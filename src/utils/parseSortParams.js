const sortOrderList = ['asc', 'desc'];

export const parseSortParams = ({ sortBy, sortOrder }, sortByList ) => {
    const parsedsortOrder = sortOrderList.includes(sortOrder) ? sortOrder : sortOrderList[0];
    const parsedSortBy = sortByList.includes(sortBy) ? sortBy : '_id';

    return {
        sortBy: parsedSortBy,
        sortOrder: parsedsortOrder
    };
};
