export type PaginationMeta = {
    currentPage: number;
    pageSize: number;
    total: number;
    totalPages: number;
};

export function getPagination(page?: string, limit?: string) {
    const currentPage = Math.max(parseInt(page || '1'), 1);
    const pageSize = Math.min(Math.max(parseInt(limit || '10'), 1), 100);

    const offset = (currentPage - 1) * pageSize;

    return {
        currentPage,
        pageSize,
        offset,
    };
}

export function buildPaginationMeta(
    currentPage: number,
    pageSize: number,
    total: number
): PaginationMeta {
    return {
        currentPage,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
    };
}
