import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import {makeStyles, ThemeProvider} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import {useSnackbar} from "notistack";
import React, {useState} from 'react';
import {rtlTheme} from "../../App";
import KeywordsList from "../../components/Chip/KeywordsList";
import ComboBox from "../../components/ComboBox/ComboBox";
import ExtendedTableRow from "../../components/Table/ExtendedTableRow";
import {OptionalTableCellProps} from "../../components/Table/OptionalTableCell";
import {educationMapToPersian} from "../../model/enum/education";
import {LoadingState} from "../../model/enum/loading-state";
import {
    PERSIAN_PROBLEM_STATES,
    ProblemState,
    problemStateMapToEnglish,
    problemStateMapToPersian
} from "../../model/enum/problem/problem-state";
import {emptyPageable, Pageable} from "../../model/pageable";
import {Problem} from "../../model/problem";
import StatelessPaginationTable from "../../components/Table/StatelessPaginationTable";

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
    }, [enqueueSnackbar, loadingState, page, rowsPerPage, selectedProblemState]);

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
                        {content: "دوره تحصیلی", width: "30%"},
                        {content: "عنوان", width: "30%"},
                        {content: "عنوان انگلیسی", smOptional: true, width: "10%"},
                        {content: "کلیدواژه‌ها", smOptional: true, width: "15%"},
                        {content: "استاد راهنما", width: "10%"},
                        {content: "", width: "5%"}
                    ]}
                    tableRow={(row: Problem, actions) => {
                        const cells: OptionalTableCellProps[] = [
                            {content: educationMapToPersian(row.education)},
                            {content: row.title, smOptional: true, dir: "ltr"},
                            {content: row.englishTitle, smOptional: true},
                            {content: <KeywordsList keywords={row.keywords}/>, smOptional: true},
                            {content: `${row.supervisor!.firstName} ${row.supervisor!.lastName}`}
                        ];
                        return <ExtendedTableRow key={row.id!} cells={cells}/>;
                    }}
                    noDataMessage={"پایان‌نامه یا پروژه‌ای تعریف نشده است."}
                    isDeletable={row => false}
                    onDeleteRow={row => undefined}
                    isEditable={row => false}
                    onEditRow={row => undefined}
                />
            </Grid>
        </ThemeProvider>
    );
}

export default ProblemListView;