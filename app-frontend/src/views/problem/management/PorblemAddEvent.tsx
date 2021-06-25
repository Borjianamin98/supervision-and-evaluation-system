import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import {ThemeProvider} from "@material-ui/core/styles";
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import DeleteIcon from '@material-ui/icons/Delete';
import {AxiosError} from "axios";
import {useSnackbar} from "notistack";
import React, {ChangeEventHandler} from 'react';
import {useMutation, useQueryClient} from "react-query";
import {rtlTheme} from "../../../App";
import MultiActionDialog from "../../../components/Dialog/MultiActionDialog";
import InputFileIconButton from "../../../components/Input/InputFileIconButton";
import CustomTextField from "../../../components/Text/CustomTextField";
import CustomTypography from "../../../components/Typography/CustomTypography";
import {generalErrorHandler} from "../../../config/axios-config";
import AuthenticationService from "../../../services/api/AuthenticationService";
import ProblemMasterService from "../../../services/api/problem/ProblemMasterService";
import LocaleUtils from "../../../utility/LocaleUtils";

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
    const [attachment, setAttachment] = React.useState<File | null>(null);
    React.useEffect(() => {
        if (!open) {
            setContent("");
            setAttachment(null);
        }
    }, [open])

    const onFileUpload: ChangeEventHandler<HTMLInputElement> = (event) => {
        const target = event.target;
        if (!target.files) {
            return; // User canceled upload file window
        }
        setAttachment(target.files[0]);
    }

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
                <Box display={attachment ? "none" : "flex"} flexDirection={"row"} alignItems={"center"}>
                    <InputFileIconButton
                        onFileChange={onFileUpload}
                        accept={"*/*"}
                    >
                        <Button
                            component={"span"}
                            variant="contained"
                            color="primary"
                            startIcon={<CloudUploadIcon/>}
                        >
                            بارگزاری
                        </Button>
                    </InputFileIconButton>
                </Box>
                {
                    attachment && <Card>
                        <CardContent>
                            <CustomTypography lineHeight={2} noWrap={true}>
                                {`نام پیوست: ${attachment.name}`}
                            </CustomTypography>
                            <CustomTypography lineHeight={2}>
                                {`اندازه پیوست: ${LocaleUtils.convertFileSizeToPersian(attachment.size)}`}
                            </CustomTypography>
                        </CardContent>
                        <CardActions>
                            <Button
                                variant={"contained"}
                                startIcon={<DeleteIcon/>}
                                color={"primary"}
                                onClick={() => setAttachment(null)}
                            >
                                حذف پیوست
                            </Button>
                        </CardActions>
                    </Card>
                }
            </MultiActionDialog>
        </ThemeProvider>
    );
}

export default ProblemAddEvent;

function convertFileSizeToPersian(size: number) {
    throw new Error("Function not implemented.");
}
