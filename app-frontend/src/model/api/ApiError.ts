export interface ApiError {
    timestamp: Date,

    status: number,
    apiPath: string,
    httpMethod: string,

    exception: string,
    detail: string,
    enMessage: string,
    faMessage: string,
}