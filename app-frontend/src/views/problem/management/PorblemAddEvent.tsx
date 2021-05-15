import {ThemeProvider} from "@material-ui/core/styles";
import {AxiosError} from "axios";
import {useSnackbar} from "notistack";
import React from 'react';
import {useMutation, useQueryClient} from "react-query";
import {rtlTheme} from "../../../App";
import SingleFieldFormDialog from "../../../components/Dialog/SingleFieldFormDialog";
import {generalErrorHandler} from "../../../config/axios-config";
import AuthenticationService from "../../../services/api/AuthenticationService";
import ProblemMasterService from "../../../services/api/problem/ProblemMasterService";

interface ProblemAddEventProps {
    open: boolean,
    problemId: number,
    problemTitle: string,
    onClose: () => void,
}

const ProblemAddEvent: React.FunctionComponent<ProblemAddEventProps> = (props) => {
    const {enqueueSnackbar} = useSnackbar();
    const {open, problemId, problemTitle, onClose} = props;

    const jwtPayloadRole = AuthenticationService.getJwtPayloadRole()!;

    const queryClient = useQueryClient();
    const commentOnProblem = useMutation(
        (data: { problemId: number, comment: string }) =>
            ProblemMasterService.addProblemEvent(data.problemId, {
                message: data.comment
            }),
        {
            onSuccess: (data, variables) => {
                return Promise.all([
                    queryClient.invalidateQueries(['problems', jwtPayloadRole]),
                    queryClient.refetchQueries(['events', variables.problemId])
                ]).then(() => enqueueSnackbar(`نظر جدید با موفقیت ثبت شد.`, {variant: "success"}))
            },
            onError: (error: AxiosError) => generalErrorHandler(error, enqueueSnackbar),
        });

    const onCommentDialogEvent = (comment?: string) => {
        if (comment) {
            commentOnProblem.mutate({
                problemId: problemId,
                comment: comment,
            });
        }
        onClose();
    };

    return (
        <ThemeProvider theme={rtlTheme}>
            <SingleFieldFormDialog
                open={open}
                onDialogOpenClose={onCommentDialogEvent}
                title="ثبت نظر"
                descriptions={[
                    "نظرات، بازخوردها یا پیشنهادات خود را برای تایید مسئله وارد نمایید.",
                    `عنوان مسئله: ${problemTitle}`
                ]}
                textFieldProps={{
                    label: "نظرات",
                    multiline: true,
                    rows: 6,
                    maxLength: 1000,
                }}
            />
        </ThemeProvider>
    );
}

export default ProblemAddEvent;