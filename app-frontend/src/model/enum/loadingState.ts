import {UseQueryResult} from "react-query/types/react";

export enum LoadingState {
    LOADING = "LOADING",
    LOADED = "LOADED",
    FAILED = "FAILED",
    FETCHING = "FETCHING"
}

export function toLoadingState<T>(result: Partial<UseQueryResult<T>>) {
    return (
        result.isLoading ? LoadingState.LOADING :
            result.isFetching ? LoadingState.FETCHING :
                result.isError ? LoadingState.FAILED :
                    LoadingState.LOADED
    )
}