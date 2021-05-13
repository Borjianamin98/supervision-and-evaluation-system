import {UseQueryResult} from "react-query/types/react";

export enum LoadingState {
    LOADING = "LOADING",
    LOADED = "LOADED",
    FAILED = "FAILED",
    FETCHING = "FETCHING"
}

export function toLoadingState<T>(result: Partial<UseQueryResult<T>>) {
    const {isLoading, isFetching, isError} = result;
    if (isLoading === undefined || isFetching === undefined || isError === undefined) {
        throw new Error("Required parameters not provided.")
    }
    return (
        isLoading ? LoadingState.LOADING :
            isFetching ? LoadingState.FETCHING :
                isError ? LoadingState.FAILED :
                    LoadingState.LOADED
    )
}