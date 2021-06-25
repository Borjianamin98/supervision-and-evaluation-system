import {ThemeProvider} from "@material-ui/core/styles";
import {AxiosError} from "axios";
import {useSnackbar} from "notistack";
import React from 'react';
import {useMutation, useQueryClient} from "react-query";
import {rtlTheme} from "../../../App";
import MultiActionDialog from "../../../components/Dialog/MultiActionDialog";
import CustomTextField from "../../../components/Text/CustomTextField";
import {generalErrorHandler} from "../../../config/axios-config";
import AuthenticationService from "../../../services/api/AuthenticationService";
import ProblemMasterService from "../../../services/api/problem/ProblemMasterService";

interface ProblemAddEventProps {
    open: boolean,
    problemId: number,
    onClose: () => void,
}

const ProblemAddEvent: React.FunctionComponent<ProblemAddEventProps> = (props) => {
    const {enqueueSnackbar} = useSnackbar();
    const {open, problemId, onClose} = props;

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
                    queryClient.refetchQueries(["problemEvents", variables.problemId])
                ]).then(() => enqueueSnackbar(`نظر جدید با موفقیت ثبت شد.`, {variant: "success"}))
            },
            onError: (error: AxiosError) => generalErrorHandler(error, enqueueSnackbar),
        });

    const [content, setContent] = React.useState("");
    React.useEffect(() => {
        if (!open) {
            setContent("");
        }
    }, [open])

    return (
        <ThemeProvider theme={rtlTheme}>
            <MultiActionDialog
                open={open}
                onAction={reason => {
                    if (reason === "closed") {
                        onClose();
                    } else if (reason === "confirm") {
                        commentOnProblem.mutate({
                            problemId: problemId,
                            comment: content,
                        }, {
                            onSuccess: () => onClose(),
                        });
                    }
                }}
                title={"ثبت نظر"}
                description={"نظرات، بازخوردها یا پیشنهادات خود را برای پایان‌نامه (پروژه) وارد نمایید."}
                actions={[
                    {
                        content: "انصراف",
                        name: "closed",
                    },
                    {
                        content: "تایید",
                        name: "confirm",
                        disabled: content.length === 0,
                    },
                ]}
            >
                <CustomTextField
                    autoFocus
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    label={"توضیحات"}
                    multiline={true}
                    rows={6}
                    maxLength={1000}
                />
            </MultiActionDialog>
        </ThemeProvider>
    );
}

export default ProblemAddEvent;