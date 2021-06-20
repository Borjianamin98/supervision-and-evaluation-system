export interface Pageable<T> {
    content: Array<T>,
    pageable: {
        sort: Sort,
        offset: number,
        pageNumber: number,
        pageSize: number,
        paged: boolean,
        unpaged: boolean,
    },

    totalElements: number,
    totalPages: number,
    last: boolean,
    first: boolean,
    size: number,
    number: number,
    empty: boolean,

    numberOfElements: number,
    sort: Sort,
}

interface Sort {
    sorted: boolean,
    unsorted: boolean,
    empty: boolean
}

export function emptyPageable<T>(): Pageable<T> {
    const defaultSort: Sort = {
        sorted: false,
        unsorted: false,
        empty: false,
    }
    return {
        content: [],
        pageable: {
            sort: defaultSort,
            offset: 0,
            pageNumber: 0,
            pageSize: 0,
            paged: true,
            unpaged: false,
        },

        totalElements: 0,
        totalPages: 0,
        last: true,
        first: true,
        size: 0,
        number: 0,
        empty: true,

        numberOfElements: 0,
        sort: defaultSort,
    }
}