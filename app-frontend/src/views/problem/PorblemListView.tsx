import {Box, Hidden} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import {makeStyles, ThemeProvider} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import HistoryIcon from '@material-ui/icons/History';
import moment from "jalali-moment";
import {useSnackbar} from "notistack";
import React, {useState} from 'react';
import {rtlTheme} from "../../App";
import CustomAlert from "../../components/Alert/CustomAlert";
import KeywordsList from "../../components/Chip/KeywordsList";
import ComboBox from "../../components/ComboBox/ComboBox";
import CollapsibleTableRow from "../../components/Table/CollapsibleTableRow";
import {OptionalTableCellProps} from "../../components/Table/OptionalTableCell";
import StatelessPaginationTable from "../../components/Table/StatelessPaginationTable";
import browserHistory from "../../config/browserHistory";
import {educationMapToPersian} from "../../model/enum/education";
import {LoadingState} from "../../model/enum/loadingState";
import {emptyPageable, Pageable} from "../../model/pageable";
import {Problem} from "../../model/problem/problem";
import {ProblemEvent} from "../../model/problem/problemEvent";
import {
    PERSIAN_PROBLEM_STATES,
    ProblemState,
    problemStateMapToEnglish,
    problemStateMapToPersian
} from "../../model/problem/problemState";
import ProblemStudentService from "../../services/api/problem/ProblemStudentService";
import {PROBLEM_EDIT_VIEW_PATH} from "../ViewPaths";

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
    }
}));

const ProblemListView: React.FunctionComponent = () => {
    const classes = useStyles();
    const {enqueueSnackbar} = useSnackbar();

    const [selectedProblemState, setSelectedProblemState] = useState<ProblemState>(ProblemState.CREATED);
    const [problems, setProblems] = React.useState<Pageable<Problem>>(emptyPageable());
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const [loadingState, setLoadingState] = React.useState<LoadingState>(LoadingState.LOADING);

    React.useEffect(() => {
        if (loadingState === LoadingState.LOADED) {
            return; // Nothing to load
        }

        ProblemStudentService.retrieveProblemsOfStudent(rowsPerPage, page, selectedProblemState)
            .then(value => {
                setProblems(value.data);
                setLoadingState(LoadingState.LOADED);
            })
            .catch(error => setLoadingState(LoadingState.FAILED));
    }, [enqueueSnackbar, loadingState, page, rowsPerPage, selectedProblemState]);

    const onEditClick = (problem: Problem) => {
        browserHistory.push({
            pathname: PROBLEM_EDIT_VIEW_PATH,
            state: problem
        })
    }

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
                                setLoadingState(LoadingState.SHOULD_RELOAD);
                            }}
                        />
                    </Grid>
                </Grid>
                <StatelessPaginationTable
                    total={problems.totalElements}
                    page={page}
                    onPageChange={newPage => {
                        setPage(newPage);
                        setLoadingState(LoadingState.SHOULD_RELOAD);
                    }}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={newRowsPerPage => {
                        setRowsPerPage(newRowsPerPage);
                        setPage(0);
                        setLoadingState(LoadingState.SHOULD_RELOAD);
                    }}
                    rowsPerPageOptions={[5, 10]}
                    loadingState={loadingState}
                    collectionData={problems.content}
                    tableHeaderCells={[
                        {content: "دوره تحصیلی", xsOptional: true, width: "10%"},
                        {content: "عنوان", width: "25%"},
                        {content: "عنوان انگلیسی", smOptional: true, width: "25%"},
                        {content: "کلیدواژه‌ها", smOptional: true, width: "25%"},
                        {content: "استاد راهنما", xsOptional: true, width: "10%"},
                        {content: "", width: "2.5%"},
                        {content: "", width: "2.5%"}
                    ]}
                    tableRow={(row: Problem, actions) => {
                        const keywordsList = <KeywordsList keywords={row.keywords} marginDir="left"/>;
                        const cells: OptionalTableCellProps[] = [
                            {content: educationMapToPersian(row.education), xsOptional: true},
                            {content: row.title},
                            {content: row.englishTitle, smOptional: true},
                            {content: keywordsList, smOptional: true},
                            {content: `${row.supervisor!.firstName} ${row.supervisor!.lastName}`, xsOptional: true},
                            {content: actions}
                        ];
                        return (
                            <CollapsibleTableRow
                                key={row.id!}
                                cells={cells}
                            >
                                <Grid container className={classes.text}>
                                    <Grid container item direction="column" xs={12} sm={12} md={5} lg={5} xl={5}>
                                        <Typography variant="h6" className={classes.tableContentHeader}>
                                            اطلاعات کلی:
                                        </Typography>
                                        <Typography paragraph>
                                            {`دوره تحصیلی: ${educationMapToPersian(row.education)}`}
                                        </Typography>
                                        <Typography paragraph>{`عنوان: ${row.title}`}</Typography>
                                        <Typography paragraph>{`عنوان انگلیسی: ${row.englishTitle}`}</Typography>
                                        <Hidden mdUp>
                                            <Typography paragraph component="span">کلیدواژه‌ها: </Typography>
                                            <Box marginBottom={2}>
                                                {keywordsList}
                                            </Box>
                                        </Hidden>
                                        <Typography paragraph>{`تعریف: ${row.definition}`}</Typography>
                                        <Typography paragraph>{`بیشینه: ${row.history}`}</Typography>
                                        <Typography paragraph>{`ملاحظات: ${row.considerations}`}</Typography>
                                    </Grid>
                                    <Grid item xs={false} sm={false} md={1} lg={1} xl={1}/>
                                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                        <Typography variant="h6" className={classes.tableContentHeader}>
                                            تغییرات:
                                        </Typography>
                                        {
                                            row.events
                                                ?.sort((a, b) =>
                                                    new Date(a.createdDate).valueOf() - new Date(b.createdDate).valueOf())
                                                .reverse()
                                                .map((event: ProblemEvent) =>
                                                    <CustomAlert
                                                        key={event.id!}
                                                        icon={<HistoryIcon/>}
                                                        severity="info"
                                                        variant="outlined"
                                                        className={classes.event}
                                                    >
                                                        {moment(event.createdDate).locale('fa').format('ddd، D MMMM YYYY (h a)')}
                                                        {": "}
                                                        {event.message}
                                                    </CustomAlert>
                                                )
                                        }
                                    </Grid>
                                </Grid>
                            </CollapsibleTableRow>
                        )
                    }}
                    noDataMessage={"پایان‌نامه یا پروژه‌ای تعریف نشده است."}
                    hasDelete={row => false}
                    isDeletable={row => false}
                    onDeleteRow={row => undefined}
                    hasEdit={row => true}
                    isEditable={row => true}
                    onEditRow={row => onEditClick(row)}
                    onRetryClick={() => setLoadingState(LoadingState.LOADING)}
                />
            </Grid>
        </ThemeProvider>
    );
}

export default ProblemListView;