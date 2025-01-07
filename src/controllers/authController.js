import * as authServices from '../services/auth-service.js';

const setupSession = (res, session) => {
    res.cookie('refreshToken', session.refreshToken, {
        httpOnly: true,
        expires: session.refreshTokenValidUntil
    });

    res.cookie('sessionId', session.id, {
        httpOnly: true,
        expires: session.refreshTokenValidUntil
    });
}

export const registerController = async (req, res) => {
    const userData = await authServices.register(req.body);

    res.status(201).json({
        status: 201,
        message: 'Successfully registered a user!',
        data: {
            name: userData.name,
            email: userData.email,
            _id: userData._id,
            createdAt: userData.createdAt,
            updatedAt: userData.updatedAt
        }
    });
};

export const loginController = async (req, res) => {
    const session = await authServices.login(req.body);

    setupSession(res, session);

    res.json({
        status: 200,
        message: 'Successfully logged in an user!',
        data: {
            accessToken: session.accessToken,
        }
    });
};

export const refreshController = async (req, res) => {
    const { refreshToken, sessionId } = req.cookies;
    const session = await authServices.refreshToken({ refreshToken, sessionId });

    setupSession(res, session);

    res.json({
        status: 200,
        message: 'Successfully refreshed a session!',
        data: {
            accessToken: session.accessToken,
            refreshToken: session.refreshToken
        }
    });
};

export const logoutController = async (req, res) => {
    if (req.cookies.sessionId) {
        await authServices.logout(req.cookies.sessionId);
    }

    res.clearCookie('refreshToken');
    res.clearCookie('sessionId');

    res.status(204).send();
};
