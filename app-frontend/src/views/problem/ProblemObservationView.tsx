import {CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import {makeStyles} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import {useSnackbar} from "notistack";
import React from 'react';
import KeywordsList from "../../components/Chip/KeywordsList";
import CollapsibleTableRow from "../../components/Table/CollapsibleTableRow";
import OptionalTableCell, {OptionalTableCellProps} from "../../components/Table/OptionalTableCell";
import {getGeneralErrorMessage} from "../../config/axios-config";
import {educationEnglishMapping, Problem, ProblemState} from "../../model/problem";
import ProblemService from "../../services/api/ProblemService";

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(3),
    },
    header: {
        margin: theme.spacing(3, 0),
        padding: theme.spacing(1, 0),
        backgroundColor: theme.palette.primary.light,
        textAlign: "center",
    },
    tableContentHeader: {
        margin: theme.spacing(2, 0),
    },
    circularProgress: {
        margin: theme.spacing(2),
    },
    rtl: {
        textAlign: "right",
    },
}));

const CollapsibleTable: React.FunctionComponent<{ problems: Array<Problem>, loaded: boolean }> = (props) => {
    const classes = useStyles();
    const {problems, loaded} = props;

    const tableHeaderCells: OptionalTableCellProps[] = [
        {content: "دوره تحصیلی"},
        {content: "عنوان"},
        {content: "عنوان انگلیسی", optional: true},
        {content: "کلیدواژه‌ها", optional: true},
        {content: "استاد راهنما"},
    ]

    const tableRows = problems.map(problem => {
        const cells: OptionalTableCellProps[] = [
            {content: educationEnglishMapping(problem.education)},
            {content: problem.title},
            {content: problem.englishTitle, optional: true},
            {content: <KeywordsList keywords={problem.keywords}/>, optional: true},
            {content: `${problem.supervisor?.firstName} ${problem.supervisor?.lastName}`},
        ];
        return (
            <CollapsibleTableRow
                key={problem.id}
                cells={cells}
            >
                <Grid dir="rtl" container className={classes.rtl}>
                    <Grid item xs={12} sm={12} md={5} lg={5} xl={5}>
                        <Typography variant="h6" className={classes.tableContentHeader}>اطلاعات کلی:</Typography>
                        <Typography paragraph>{`عنوان: ${problem.title}`}</Typography>
                        <Typography paragraph>{`عنوان انگلیسی: ${problem.englishTitle}`}</Typography>
                    </Grid>
                    <Grid item xs={false} sm={false} md={1} lg={1} xl={1}/>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                        <Typography variant="h6" className={classes.tableContentHeader}>نظرات:</Typography>
                    </Grid>
                </Grid>
            </CollapsibleTableRow>
        );
    });

    const FullRowCell: React.FunctionComponent = (props) =>
        <TableRow>
            <TableCell align="center" colSpan={tableHeaderCells.length + 1}>{props.children}</TableCell>
        </TableRow>

    return (
        <TableContainer dir="rtl" component={Paper} elevation={4}>
            <Table>
                <TableHead>
                    <TableRow>
                        {tableHeaderCells.map((cell, index) => (
                            <OptionalTableCell key={index} align="right"
                                               content={cell.content}
                                               optional={cell.optional}/>
                        ))}
                        <TableCell width={"5%"}/>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        loaded ? (problems.length === 0 ? <FullRowCell>مسئله‌ای یافت نشد.</FullRowCell> : tableRows) :
                            (
                                <FullRowCell>
                                    <CircularProgress className={classes.circularProgress}/>
                                </FullRowCell>
                            )
                    }
                </TableBody>
            </Table>
        </TableContainer>
    );
}

const ProblemObservationView: React.FunctionComponent = () => {
    const classes = useStyles();
    const [ownerProblems, setOwnerProblems] = React.useState<Problem[]>([]);
    const [loaded, setLoaded] = React.useState<boolean>(false);
    const {enqueueSnackbar} = useSnackbar();

    React.useEffect(() => {
        ProblemService.retrieveOwnerProblem()
            .then(value => {
                setOwnerProblems(value.data);
                setLoaded(true);
            })
            .catch(error => {
                const {message, statusCode} = getGeneralErrorMessage(error);
                if (statusCode) {
                    enqueueSnackbar(`در دریافت اطلاعات از سرور خطای ${statusCode} دریافت شد. دوباره تلاش نمایید.`,
                        {variant: "error"});
                } else {
                    enqueueSnackbar(message, {variant: "error"});
                }
            });
    }, [enqueueSnackbar])

    return (
        <Paper variant="outlined" square className={classes.root}>
            <Paper dir="rtl" className={classes.header}>
                <Typography variant="h6">مسئله‌های جدید</Typography>
            </Paper>
            <CollapsibleTable loaded={loaded}
                              problems={ownerProblems.filter(problem => problem.state === ProblemState.CREATED)}/>
            <Paper dir="rtl" className={classes.header}>
                <Typography variant="h6">مسئله‌های در حال پیگیری</Typography>
            </Paper>
            <CollapsibleTable loaded={loaded}
                              problems={ownerProblems.filter(problem => problem.state === ProblemState.IN_PROGRESS)}/>
            <Paper dir="rtl" className={classes.header}>
                <Typography variant="h6">مسئله‌های اتمام‌یافته</Typography>
            </Paper>
            <CollapsibleTable loaded={loaded}
                              problems={ownerProblems.filter(problem => problem.state === ProblemState.COMPLETED)}/>
        </Paper>
    );
}

export default ProblemObservationView;