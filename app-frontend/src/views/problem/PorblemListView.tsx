import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import {makeStyles, ThemeProvider} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import AddCommentIcon from '@material-ui/icons/AddComment';
import CloseIcon from '@material-ui/icons/Close';
import DoneIcon from '@material-ui/icons/Done';
import VisibilityIcon from '@material-ui/icons/Visibility';
import {AxiosError} from "axios";
import {useSnackbar} from "notistack";
import React, {useState} from 'react';
import {useMutation, useQuery, useQueryClient} from "react-query";
import {rtlTheme} from "../../App";
import KeywordsList from "../../components/Chip/KeywordsList";
import ComboBox from "../../components/ComboBox/ComboBox";
import ConfirmDialog from "../../components/Dialog/ConfirmDialog";
import CollapsibleTableRow from "../../components/Table/CollapsibleTableRow";
import {OptionalTableCellProps} from "../../components/Table/OptionalTableCell";
import StatelessPaginationTable, {StatelessPaginationListAction} from "../../components/Table/StatelessPaginationTable";
import {generalErrorHandler} from "../../config/axios-config";
import browserHistory from "../../config/browserHistory";
import {educationMapToPersian} from "../../model/enum/education";
import {toLoadingState} from "../../model/enum/loadingState";
import {Role} from "../../model/enum/role";
import {Problem} from "../../model/problem/problem";
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
import {ProblemEditLocationState} from "./edit/ProblemEdit";
import ProblemAddEvent from "./management/PorblemAddEvent";
import ProblemEventsList from "./ProblemEventsList";
import ProblemInfoList from "./ProblemInfoList";

const useStyles = makeStyles((theme) => ({
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
    justifyAlign: {
        textAlign: "justify",
    },
}));

const ProblemListView: React.FunctionComponent = () => {
    const classes = useStyles();
    const {enqueueSnackbar} = useSnackbar();

    const [selectedProblemState, setSelectedProblemState] = useState<ProblemState>(ProblemState.CREATED);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const jwtPayloadRole = AuthenticationService.getJwtPayloadRole()!;

    const queryClient = useQueryClient();
    const {
        data: problems,
        ...problemsQuery
    } = useQuery(['problems', jwtPayloadRole, selectedProblemState, rowsPerPage, page],
        () => {
            if (jwtPayloadRole === Role.STUDENT) {
                return ProblemStudentService.retrieveProblemsOfStudent(rowsPerPage, page, selectedProblemState);
            } else if (jwtPayloadRole === Role.MASTER) {
                return ProblemMasterService.retrieveAssignedProblems(rowsPerPage, page, selectedProblemState);
            } else {
                throw new Error("Unexpected view for current authenticated user: " + jwtPayloadRole);
            }
        }, {
            keepPreviousData: true
        });

    const abandonProblem = useMutation(
        (problemId: number) => ProblemAuthenticatedService.abandonProblem(problemId),
        {
            onSuccess: data => queryClient.invalidateQueries(['problems', jwtPayloadRole, selectedProblemState, rowsPerPage])
                .then(() => enqueueSnackbar(`پایان‌نامه (پروژه) ${data.title} به وضعیت لغو شده منتقل شد.`, {variant: "success"})),
            onError: (error: AxiosError) => generalErrorHandler(error, enqueueSnackbar),
        });
    const approveProblem = useMutation(
        (problemId: number) => ProblemMasterService.initialApprovalOfProblem(problemId),
        {
            onSuccess: data => queryClient.invalidateQueries(['problems', jwtPayloadRole, selectedProblemState, rowsPerPage])
                .then(() => enqueueSnackbar(`پایان‌نامه (پروژه) ${data.title} مورد تایید اولیه قرار گرفت.`, {variant: "success"})),
            onError: (error: AxiosError) => generalErrorHandler(error, enqueueSnackbar),
        });

    const onEditClick = (problem: Problem) => {
        browserHistory.push({
            pathname: PROBLEM_EDIT_VIEW_PATH,
            state: {
                problemId: problem.id,
                problemSave: {...problem, supervisorId: problem.supervisor.id},
                problemSupervisor: problem.supervisor,
            } as ProblemEditLocationState
        })
    }

    const onManageProblem = (problem: Problem) => {
        browserHistory.push(`${PROBLEM_MANAGEMENT_VIEW_PATH}/${problem.id}`);
    }

    const getExtraActions = (): StatelessPaginationListAction<Problem>[] => {
        switch (selectedProblemState) {
            case ProblemState.CREATED:
                switch (jwtPayloadRole) {
                    case Role.STUDENT:
                        return [
                            {tooltipTitle: "ثبت نظر", icon: <AddCommentIcon/>, onClickAction: onCommentDialogOpen},
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
            case ProblemState.COMPLETED:
                switch (jwtPayloadRole) {
                    case Role.STUDENT:
                    case Role.MASTER:
                        return [
                            {tooltipTitle: "مشاهده", icon: <VisibilityIcon/>, onClickAction: onManageProblem},
                        ];
                    default:
                        throw new Error("Unexpected role: " + jwtPayloadRole);
                }
            case ProblemState.ABANDONED:
                return [];
        }
    }

    const [commentProblem, setCommentProblem] = useState<Problem>();
    const [commentDialogOpen, setCommentDialogOpen] = React.useState(false);
    const onCommentDialogOpen = (problem: Problem) => {
        setCommentProblem(problem);
        setCommentDialogOpen(true);
    };

    const [abandonDialogOpen, setAbandonDialogOpen] = React.useState(false);
    const [abandonedProblem, setAbandonedProblem] = useState<Problem>();
    const onAbandonDialogOpen = (problem: Problem) => {
        setAbandonedProblem(problem);
        setAbandonDialogOpen(true);
    };
    const onAbandonDialogEvent = (confirmed: boolean) => {
        if (confirmed) {
            abandonProblem.mutate(abandonedProblem!.id!);
        }
        setAbandonDialogOpen(false);
    };

    const [approvalDialogOpen, setApprovalDialogOpen] = React.useState(false);
    const [approvalProblem, setApprovalProblem] = useState<Problem>();
    const onApprovalDialogOpen = (problem: Problem) => {
        setApprovalProblem(problem);
        setApprovalDialogOpen(true);
    };
    const onApprovalDialogEvent = (confirmed: boolean) => {
        if (confirmed) {
            approveProblem.mutate(approvalProblem!.id!);
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
                            filterOptions={(options) => options} // do not filter values
                            textFieldInputProps={{
                                label: "وضعیت",
                            }}
                            value={problemStateMapToPersian(selectedProblemState)}
                            onChange={(e, newValue) => {
                                setSelectedProblemState(problemStateMapToEnglish(newValue));
                            }}
                        />
                    </Grid>
                </Grid>
                <StatelessPaginationTable
                    total={problems ? problems.totalElements : 0}
                    page={page}
                    onPageChange={newPage => setPage(newPage)}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={newRowsPerPage => {
                        setRowsPerPage(newRowsPerPage);
                        setPage(0);
                    }}
                    rowsPerPageOptions={[5, 10]}
                    loadingState={toLoadingState(problemsQuery)}
                    collectionData={problems ? problems.content : []}
                    tableHeaderCells={[
                        {content: "دوره تحصیلی", smOptional: true, width: "10%"},
                        {content: "عنوان", width: "30%"},
                        {content: "کلیدواژه‌ها", mdOptional: true, width: "20%"},
                        {content: "دانشجو", xsOptional: true, width: "10%"},
                        {content: "استاد راهنما", xsOptional: true, width: "10%"},
                        ...(problems?.content.some(p => p.referees.length !== 0) ?
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
                            {content: educationMapToPersian(row.education), smOptional: true},
                            {content: row.title},
                            {content: keywordsList, mdOptional: true},
                            {content: row.student.fullName, xsOptional: true},
                            {content: row.supervisor.fullName, xsOptional: true},
                            ...(problems?.content.some(p => p.referees.length !== 0) ?
                                [{
                                    content: row.referees.map(r => r.fullName!).join("، "),
                                    xsOptional: true,
                                    width: "10%"
                                }] : []),
                            {content: actions}
                        ];

                        return (
                            <CollapsibleTableRow
                                key={row.id}
                                cells={cells}
                            >
                                <Grid container className={classes.justifyAlign}>
                                    <Grid container item direction="column" xs={12} sm={12} md={5} lg={5} xl={5}>
                                        <Typography variant="h6" className={classes.tableContentHeader}>
                                            اطلاعات کلی
                                        </Typography>
                                        <ProblemInfoList problem={row}/>
                                    </Grid>
                                    <Grid item xs={false} sm={false} md={1} lg={1} xl={1}/>
                                    <Grid container item direction="column" xs={12} sm={12} md={6} lg={6} xl={6}>
                                        <Typography variant="h6" className={classes.tableContentHeader}>
                                            رخدادهای اخیر
                                        </Typography>
                                        {<ProblemEventsList problemId={row.id!} pageSize={3}/>}
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
                    onRetryClick={() =>
                        queryClient.invalidateQueries(['problems', jwtPayloadRole, selectedProblemState, rowsPerPage, page])}
                />
                <div aria-label={"dialogs"}>
                    <ProblemAddEvent
                        open={commentDialogOpen}
                        problemId={commentProblem ? commentProblem.id! : 0}
                        problemTitle={commentProblem ? commentProblem.title : ""}
                        onClose={() => setCommentDialogOpen(false)}
                    />
                    <ConfirmDialog
                        open={abandonDialogOpen}
                        onAction={onAbandonDialogEvent}
                        title={"لغو پایان‌نامه (پروژه)"}
                        description={"در صورتی که تمایل به لغو مسئله ایجاد شده دارید، تایید نمایید. دقت کنید که این عمل برگشت‌پذیر نمی‌باشد."}
                    />
                    <ConfirmDialog
                        open={approvalDialogOpen}
                        onAction={onApprovalDialogEvent}
                        title={"تایید اولیه پایان‌نامه (پروژه)"}
                        description={"با تایید اولیه مسئله، کلیت مسئله و توضیحات آن مورد تایید قرار می‌گیرد و ادامه‌ی روند مسئله در بخش مسائل در حال پیگیری دنبال می‌شود."}
                    />
                </div>
            </Grid>
        </ThemeProvider>
    );
}

export default ProblemListView;