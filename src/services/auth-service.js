import createHttpError from 'http-errors';

import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

import jwt from 'jsonwebtoken';

import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';

import { TEMPLATES_DIR } from '../constants/index.js';

import { SMTP } from '../constants/index.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import { sendEmail } from '../utils/sendEmail.js';

import User from '../db/models/User.js';
import Session from '../db/models/Session.js';

import { accessTokenLifeTime, refreshTokenLifeTime } from '../constants/users.js';

const createSessionData = () => ({
    accessToken: randomBytes(30).toString('base64'),
    refreshToken: randomBytes(30).toString('base64'),
    accessTokenValidUntil: Date.now() + accessTokenLifeTime,
    refreshTokenValidUntil: Date.now() + refreshTokenLifeTime
});


export const register = async payload => {
    const { email, password } = payload;
    const user = await User.findOne({ email });
    if (user) {
        throw createHttpError(409, 'Email in use');
    };

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({ ...payload, password: hashPassword });

    return newUser;
};

export const login = async ({ email, password }) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw createHttpError(401, 'Email or password invalid');
    };

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
        throw createHttpError(401, 'Email or password invalid');
    };

    await Session.deleteOne({ userId: user._id });

    const sessionData = createSessionData();

    return Session.create({
        userId: user._id,
        ...sessionData
    });
};

export const refreshToken = async (payload) => {
    const session = await Session.findOne({
        _id: payload.sessionId,
        refreshToken: payload.refreshToken,
    });
    if (!session) {
        throw createHttpError(401, 'Session not found');
    };
    if (Date.now() > session.refreshTokenValidUntil) {
        throw createHttpError(401, 'Refresh token expired');
    };

    await Session.deleteOne({ id: payload.sessionId });

    const sessionData = createSessionData();

    return Session.create({
        userId: session.userId,
        ...sessionData
    });
};

export const requestResetToken = async (email) => {
    const user = await User.findOne({ email });

    if (!user) {
      throw createHttpError(404, 'User not found');
    }

    const resetToken = jwt.sign(
        {
           sub: user._id,
           email,
        },

        getEnvVar('JWT_SECRET'),

        {
          expiresIn: '15m',
        },
    );

    const resetPasswordTemplatePath = path.join(
       TEMPLATES_DIR,
       'reset-password-email.html',
    );

    const templateSource = (
        await fs.readFile(resetPasswordTemplatePath)
    ).toString();

    const template = handlebars.compile(templateSource);
    const html = template({
        name: user.name,
        link: `${getEnvVar('APP_DOMAIN')}/reset-password?token=${resetToken}`,
    });

    await sendEmail({
       from: getEnvVar(SMTP.SMTP_FROM),
       to: email,
       subject: 'Reset your password',
       html,
    });
};

export const resetPassword = async (payload) => {
  let entries;

  try {
    entries = jwt.verify(payload.token, getEnvVar('JWT_SECRET'));
  } catch (err) {
    if (err instanceof Error) throw createHttpError(401, err.message);
    throw err;
  }

  const user = await User.findOne({
    email: entries.email,
    _id: entries.sub,
  });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  await User.updateOne(
    { _id: user._id },
    { password: encryptedPassword },
  );
};

export const logout = async sessionId => {
    await Session.deleteOne({ _id: sessionId });
};

export const getUser = filter => User.findOne(filter);

export const getSession = filter => Session.findOne(filter);
