const parseNumber = (number, defaultValue) => {
    if (typeof number !== 'string') return defaultValue;

    const parsedNumber = parseInt(number);

    if (Number.isNaN(parsedNumber)) return defaultValue;

    return parsedNumber
};

export const parsePaginationParams = ({ page, perPage }) => {
    const parsedPage = parseNumber(page, 1);
    const parsedPerPage = parseNumber(page, 1);

    return {
        page: parsedPage,
        perPage: parsedPerPage
    }
};
