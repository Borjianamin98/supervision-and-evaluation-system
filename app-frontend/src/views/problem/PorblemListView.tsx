import {Box, DialogActions, DialogContent, DialogTitle, Hidden} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContentText from "@material-ui/core/DialogContentText";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import {makeStyles, ThemeProvider} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import AddCommentIcon from '@material-ui/icons/AddComment';
import CloseIcon from '@material-ui/icons/Close';
import DoneIcon from '@material-ui/icons/Done';
import VisibilityIcon from '@material-ui/icons/Visibility';
import {AxiosError, AxiosResponse} from "axios";
import moment from "jalali-moment";
import {useSnackbar} from "notistack";
import React, {useState} from 'react';
import {rtlTheme} from "../../App";
import CustomAlert from "../../components/Alert/CustomAlert";
import HistoryInfoAlert from "../../components/Alert/HistoryInfoAlert";
import KeywordsList from "../../components/Chip/KeywordsList";
import ComboBox from "../../components/ComboBox/ComboBox";
import ConfirmDialog from "../../components/Dialog/ConfirmDialog";
import CollapsibleTableRow from "../../components/Table/CollapsibleTableRow";
import {OptionalTableCellProps} from "../../components/Table/OptionalTableCell";
import StatelessPaginationTable, {StatelessPaginationListAction} from "../../components/Table/StatelessPaginationTable";
import CustomTextField from "../../components/Text/CustomTextField";
import {getGeneralErrorMessage} from "../../config/axios-config";
import browserHistory from "../../config/browserHistory";
import {educationMapToPersian} from "../../model/enum/education";
import {LoadingState} from "../../model/enum/loadingState";
import {Role} from "../../model/enum/role";
import {emptyPageable, Pageable} from "../../model/pageable";
import {Problem} from "../../model/problem/problem";
import {ProblemEvent} from "../../model/problem/problemEvent";
import {
    PERSIAN_PROBLEM_STATES,
    ProblemState,
    problemStateMapToEnglish,
    problemStateMapToPersian
} from "../../model/problem/problemState";
import AuthenticationService from "../../services/api/AuthenticationService";
import ProblemAuthenticatedService from "../../services/api/problem/ProblemAuthenticatedService";
import ProblemMasterService from "../../services/api/problem/ProblemMasterService";
import ProblemStudentService from "../../services/api/problem/ProblemStudentService";
import {PROBLEM_EDIT_VIEW_PATH, PROBLEM_MANAGEMENT_VIEW_PATH} from "../ViewPaths";

const useStyles = makeStyles((theme) => ({
    noWrap: {
        wrap: "nowrap",
    },
    createGrid: {
        margin: theme.spacing(1, 0),
        padding: theme.spacing(2),
    },
    gridItem: {
        padding: theme.spacing(0, 1),
    },
    tableContentHeader: {
        margin: theme.spacing(2, 0),
    },
    text: {
        textAlign: "justify",
    },
    event: {
        margin: theme.spacing(1, 0),
    },
}));

const ProblemListView: React.FunctionComponent = () => {
    const classes = useStyles();
    const {enqueueSnackbar} = useSnackbar();

    const [selectedProblemState, setSelectedProblemState] = useState<ProblemState>(ProblemState.CREATED);
    const [problems, setProblems] = React.useState<Pageable<Problem>>(emptyPageable());
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [loadingState, setLoadingState] = React.useState<LoadingState>(LoadingState.LOADING);

    const jwtPayloadRole = AuthenticationService.getJwtPayloadRole()!;

    React.useEffect(() => {
        if (loadingState === LoadingState.LOADED) {
            return; // Nothing to load
        }

        let request: Promise<AxiosResponse<Pageable<Problem>>>;
        if (jwtPayloadRole === Role.STUDENT) {
            request = ProblemStudentService.retrieveProblemsOfStudent(rowsPerPage, page, selectedProblemState);
        } else if (jwtPayloadRole === Role.MASTER) {
            request = ProblemMasterService.retrieveAssignedProblems(rowsPerPage, page, selectedProblemState);
        } else {
            throw new Error("Unexpected view for current authenticated user: " + jwtPayloadRole);
        }
        request
            .then(value => {
                setProblems(value.data);
                setLoadingState(LoadingState.LOADED);
            })
            .catch(error => setLoadingState(LoadingState.FAILED));
    }, [jwtPayloadRole, loadingState, page, rowsPerPage, selectedProblemState]);

    const onEditClick = (problem: Problem) => {
        browserHistory.push({
            pathname: PROBLEM_EDIT_VIEW_PATH,
            state: problem
        })
    }

    const onManageProblem = (problem: Problem) => {
        browserHistory.push(`${PROBLEM_MANAGEMENT_VIEW_PATH}/${problem.id!}`);
    }

    const getExtraActions = (): StatelessPaginationListAction<Problem>[] => {
        switch (selectedProblemState) {
            case ProblemState.CREATED:
                switch (jwtPayloadRole) {
                    case Role.STUDENT:
                        return [
                            {
                                tooltipTitle: "لغو مسئله",
                                icon: <CloseIcon/>,
                                onClickAction: onAbandonDialogOpen
                            },
                        ];
                    case Role.MASTER:
                        return [
                            {tooltipTitle: "ثبت نظر", icon: <AddCommentIcon/>, onClickAction: onCommentDialogOpen},
                            {tooltipTitle: "تایید اولیه", icon: <DoneIcon/>, onClickAction: onApprovalDialogOpen},
                            {tooltipTitle: "رد مسئله", icon: <CloseIcon/>, onClickAction: onAbandonDialogOpen},
                        ];
                    default:
                        throw new Error("Unexpected role: " + jwtPayloadRole);
                }
            case ProblemState.IN_PROGRESS:
                switch (jwtPayloadRole) {
                    case Role.STUDENT:
                    case Role.MASTER:
                        return [
                            {tooltipTitle: "مشاهده", icon: <VisibilityIcon/>, onClickAction: onManageProblem},
                        ];
                    default:
                        throw new Error("Unexpected role: " + jwtPayloadRole);
                }
            case ProblemState.COMPLETED:
            case ProblemState.ABANDONED:
                return [];
        }
    }

    const [errorChecking, setErrorChecking] = React.useState(false);
    const isBlank = (c: string) => errorChecking && c.length === 0;

    const [commentProblem, setCommentProblem] = useState<Problem>(ProblemStudentService.createInitialProblem());
    const [comment, setComment] = useState<string>("");
    const [commentDialogOpen, setCommentDialogOpen] = React.useState(false);

    const handleFailedRequest = (error: AxiosError) => {
        const {statusCode, message} = getGeneralErrorMessage(error);
        if (statusCode) {
            enqueueSnackbar(`در ارسال درخواست از سرور خطای ${statusCode} دریافت شد.`,
                {variant: "error"});
        } else if (!statusCode) {
            enqueueSnackbar(message, {variant: "error"});
        }
    }

    const handleSuccessComment = (problemEvent: ProblemEvent) => {
        enqueueSnackbar(`نظر با موفقیت ثبت شد.`, {variant: "success"});
        setLoadingState(LoadingState.FETCHING);
    }

    const onCommentDialogOpen = (problem: Problem) => {
        setComment("");
        setCommentProblem(problem);
        setErrorChecking(false);
        setCommentDialogOpen(true);
    };

    const onCommentDialogClose = (shouldUpdate: boolean) => {
        if (shouldUpdate) {
            if (comment.length === 0) {
                setErrorChecking(true);
                return;
            }
            ProblemMasterService.placeCommentOnProblem(commentProblem.id!, {
                message: comment
            })
                .then(value => handleSuccessComment(value.data))
                .catch(error => handleFailedRequest(error))
        }
        setCommentDialogOpen(false);
    };

    const [abandonDialogOpen, setAbandonDialogOpen] = React.useState(false);
    const [abandonProblem, setAbandonProblem] = useState<Problem>(ProblemStudentService.createInitialProblem());

    const handleSuccessAbandon = (problem: Problem) => {
        enqueueSnackbar(`پایان‌نامه (پروژه) ${problem.title} به وضعیت لغو شده منتقل شد.`, {variant: "success"});
        setLoadingState(LoadingState.FETCHING);
    }

    const onAbandonDialogOpen = (problem: Problem) => {
        setAbandonProblem(problem);
        setAbandonDialogOpen(true);
    };

    const onAbandonDialogEvent = (confirmed: boolean) => {
        if (confirmed) {
            ProblemAuthenticatedService.abandonProblem(abandonProblem.id!)
                .then(value => handleSuccessAbandon(value.data))
                .catch(error => handleFailedRequest(error))
        }
        setAbandonDialogOpen(false);
    };

    const [approvalDialogOpen, setApprovalDialogOpen] = React.useState(false);
    const [approvalProblem, setApprovalProblem] = useState<Problem>(ProblemStudentService.createInitialProblem());

    const handleSuccessApproval = (problem: Problem) => {
        enqueueSnackbar(`پایان‌نامه (پروژه) ${problem.title} مورد تایید اولیه قرار گرفت.`, {variant: "success"});
        setLoadingState(LoadingState.FETCHING);
    }

    const onApprovalDialogOpen = (problem: Problem) => {
        setApprovalProblem(problem);
        setApprovalDialogOpen(true);
    };

    const onApprovalDialogEvent = (confirmed: boolean) => {
        if (confirmed) {
            ProblemMasterService.initialApprovalOfProblem(approvalProblem.id!)
                .then(value => handleSuccessApproval(value.data))
                .catch(error => handleFailedRequest(error))
        }
        setApprovalDialogOpen(false);
    };

    return (
        <ThemeProvider theme={rtlTheme}>
            <Grid container direction="column">
                <Grid container dir="rtl"
                      component={Paper}
                      elevation={4}
                      className={classes.createGrid}
                >
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Typography variant="h6" gutterBottom>
                            اطلاعات پایان‌نامه (پروژه)
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} className={classes.gridItem}>
                        <ComboBox
                            disableListWrap
                            options={PERSIAN_PROBLEM_STATES}
                            textFieldInputProps={{
                                label: "وضعیت",
                            }}
                            value={problemStateMapToPersian(selectedProblemState)}
                            onChange={(e, newValue) => {
                                setSelectedProblemState(problemStateMapToEnglish(newValue));
                                setLoadingState(LoadingState.FETCHING);
                            }}
                        />
                    </Grid>
                </Grid>
                <StatelessPaginationTable
                    total={problems.totalElements}
                    page={page}
                    onPageChange={newPage => {
                        setPage(newPage);
                        setLoadingState(LoadingState.FETCHING);
                    }}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={newRowsPerPage => {
                        setRowsPerPage(newRowsPerPage);
                        setPage(0);
                        setLoadingState(LoadingState.FETCHING);
                    }}
                    rowsPerPageOptions={[5, 10]}
                    loadingState={loadingState}
                    collectionData={problems.content}
                    tableHeaderCells={[
                        {content: "دوره تحصیلی", xsOptional: true, width: "10%"},
                        {content: "عنوان", width: "30%"},
                        {content: "کلیدواژه‌ها", smOptional: true, width: "25%"},
                        {content: "استاد راهنما", xsOptional: true, width: "15%"},
                        ...(problems.content.some(p => p.referees.length !== 0) ?
                            [{
                                content: "استادهای داور", xsOptional: true,
                                width: "15%"
                            }] : []),
                        {content: "", width: "2.5%"},
                        {content: "", width: "2.5%"}
                    ]}
                    tableRow={(row: Problem, actions) => {
                        const keywordsList = <KeywordsList keywords={row.keywords} marginDir="left"/>;
                        const cells: OptionalTableCellProps[] = [
                            {content: educationMapToPersian(row.education), xsOptional: true},
                            {content: row.title},
                            {content: keywordsList, smOptional: true},
                            {content: row.supervisor!.fullName, xsOptional: true},
                            ...(problems.content.some(p => p.referees.length !== 0) ?
                                [{
                                    content: row.referees.map(r => r.fullName!).join("، "),
                                    xsOptional: true,
                                    width: "10%"
                                }] : []),
                            {content: actions}
                        ];
                        const events = row.events.sort((a, b) =>
                            new Date(a.createdDate!).valueOf() - new Date(b.createdDate!).valueOf())
                            .reverse()
                            .slice(0, 10)
                            .map((event: ProblemEvent) =>
                                <HistoryInfoAlert
                                    key={event.id!}
                                    className={classes.event}
                                >
                                    {event.createdBy}
                                    {"، "}
                                    {moment(event.createdDate!).locale('fa').format('ddd، D MMMM YYYY (h:mm a)')}
                                    {": "}
                                    {event.message}
                                </HistoryInfoAlert>
                            )

                        return (
                            <CollapsibleTableRow
                                key={row.id!}
                                cells={cells}
                            >
                                <Grid container className={classes.text}>
                                    <Grid container item direction="column" xs={12} sm={12} md={5} lg={5} xl={5}>
                                        <Typography variant="h6" className={classes.tableContentHeader}>
                                            اطلاعات کلی
                                        </Typography>
                                        <Typography paragraph>
                                            {`دوره تحصیلی: ${educationMapToPersian(row.education)}`}
                                        </Typography>
                                        <Typography paragraph>{`عنوان: ${row.title}`}</Typography>
                                        <Typography paragraph>{`عنوان انگلیسی: ${row.englishTitle}`}</Typography>
                                        <Hidden mdUp>
                                            <Typography paragraph>کلیدواژه‌ها: </Typography>
                                            <Box marginBottom={2}>
                                                {keywordsList}
                                            </Box>
                                        </Hidden>
                                        <Typography paragraph>{`تعریف: ${row.definition}`}</Typography>
                                        <Typography paragraph>{`بیشینه: ${row.history}`}</Typography>
                                        <Typography paragraph>{`ملاحظات: ${row.considerations}`}</Typography>
                                        <Typography paragraph>
                                            {"استاد راهنما: "}
                                            {row.supervisor?.fullName ?? ""}
                                        </Typography>
                                        <Typography paragraph>
                                            {"استادهای داور: "}
                                            {row.referees.length !== 0 ? row.referees.map(r => r.fullName!).join("، ") : "داوری تعیین نشده است."}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={false} sm={false} md={1} lg={1} xl={1}/>
                                    <Grid container item direction="column" xs={12} sm={12} md={6} lg={6} xl={6}>
                                        <Typography variant="h6" className={classes.tableContentHeader}>
                                            رخدادهای اخیر
                                        </Typography>
                                        {events.length !== 0 ? events :
                                            <CustomAlert variant="outlined" severity="info"
                                                         className={classes.event}>
                                                هیچ رخدادی وجود ندارد.
                                            </CustomAlert>}
                                    </Grid>
                                </Grid>
                            </CollapsibleTableRow>
                        )
                    }}
                    noDataMessage={"پایان‌نامه یا پروژه‌ای تعریف نشده است."}
                    hasDelete={row => false}
                    isDeletable={row => false}
                    onDeleteRow={row => undefined}
                    hasEdit={row => jwtPayloadRole === Role.STUDENT && selectedProblemState === ProblemState.CREATED}
                    isEditable={row => true}
                    onEditRow={row => onEditClick(row)}
                    extraActions={getExtraActions()}
                    onRetryClick={() => setLoadingState(LoadingState.LOADING)}
                />
                <div aria-label={"dialogs"}>
                    <Dialog dir="rtl" open={commentDialogOpen} onClose={() => onCommentDialogClose(false)}>
                        <DialogTitle>ثبت نظر</DialogTitle>
                        <DialogContent>
                            <DialogContentText style={{textAlign: "justify"}}>
                                نظرات، بازخوردها یا پیشنهادات خود را برای تایید مسئله وارد نمایید.
                            </DialogContentText>
                            <Typography paragraph>{`عنوان مسئله: ${commentProblem.title}`}</Typography>
                            <CustomTextField
                                autoFocus
                                label="نظرات"
                                multiline={true}
                                rows={6}
                                maxLength={1000}
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                helperText={isBlank(comment) ? "ثبت نظر خالی امکان‌پذیر نمی‌باشد." : ""}
                                error={isBlank(comment)}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => onCommentDialogClose(false)} color="primary">
                                انصراف
                            </Button>
                            <Button onClick={() => onCommentDialogClose(true)} color="primary">
                                ثبت نظر
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <ConfirmDialog
                        open={abandonDialogOpen}
                        onDialogOpenClose={onAbandonDialogEvent}
                        title={"لغو پایان‌نامه (پروژه)"}
                        description={"در صورتی که تمایل به لغو مسئله ایجاد شده دارید، تایید نمایید. دقت کنید که این عمل برگشت‌پذیر نمی‌باشد."}
                    />
                    <ConfirmDialog
                        open={approvalDialogOpen}
                        onDialogOpenClose={onApprovalDialogEvent}
                        title={"تایید اولیه پایان‌نامه (پروژه)"}
                        description={"با تایید اولیه مسئله، کلیت مسئله و توضیحات آن مورد تایید قرار می‌گیرد و ادامه‌ی روند مسئله در بخش مسائل در حال پیگیری دنبال می‌شود."}
                    />
                </div>
            </Grid>
        </ThemeProvider>
    );
}

export default ProblemListView;