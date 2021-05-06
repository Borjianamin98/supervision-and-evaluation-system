import {
    Box,
    CircularProgress,
    Hidden,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import {makeStyles} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import {useSnackbar} from "notistack";
import React from 'react';
import KeywordsList from "../../components/Chip/KeywordsList";
import CollapsibleTableRow from "../../components/Table/CollapsibleTableRow";
import FullRowCell from "../../components/Table/FullRowCell";
import OptionalTableCell, {OptionalTableCellProps} from "../../components/Table/OptionalTableCell";
import {getGeneralErrorMessage} from "../../config/axios-config";
import {educationMapToPersian} from "../../model/enum/education";
import {ProblemState} from "../../model/enum/problem/problem-state";
import {Problem} from "../../model/problem";
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
    text: {
        textAlign: "justify",
    },
}));

const CollapsibleTable: React.FunctionComponent<{ problems: Array<Problem>, loaded: boolean }> = (props) => {
    const classes = useStyles();
    const {problems, loaded} = props;

    const tableHeaderCells: OptionalTableCellProps[] = [
        {content: "دوره تحصیلی"},
        {content: "عنوان"},
        {content: "عنوان انگلیسی", smOptional: true},
        {content: "کلیدواژه‌ها", smOptional: true},
        {content: "استاد راهنما"},
    ]

    const tableRows = problems.map(problem => {
        const keywordsList = <KeywordsList keywords={problem.keywords}/>;
        const cells: OptionalTableCellProps[] = [
            {content: educationMapToPersian(problem.education)},
            {content: problem.title},
            {content: problem.englishTitle, smOptional: true},
            {content: keywordsList, smOptional: true},
            {content: `${problem.supervisor?.firstName} ${problem.supervisor?.lastName}`},
        ];

        return (
            <CollapsibleTableRow
                key={problem.id}
                cells={cells}
            >
                <Grid dir="rtl" container className={classes.text}>
                    <Grid item xs={12} sm={12} md={5} lg={5} xl={5}>
                        <Typography variant="h6" className={classes.tableContentHeader}>اطلاعات کلی:</Typography>
                        <Typography paragraph>{`عنوان: ${problem.title}`}</Typography>
                        <Typography paragraph>{`عنوان انگلیسی: ${problem.englishTitle}`}</Typography>
                        <Hidden mdUp>
                            <Box marginY={1}>
                                <Typography paragraph component="span">کلیدواژه‌ها: </Typography>
                                {keywordsList}
                            </Box>
                        </Hidden>
                        <Typography paragraph>{`تعریف: ${problem.definition}`}</Typography>
                        <Typography paragraph>{`بیشینه: ${problem.history}`}</Typography>
                        <Typography paragraph>{`ملاحظات: ${problem.considerations}`}</Typography>
                    </Grid>
                    <Grid item xs={false} sm={false} md={1} lg={1} xl={1}/>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                        <Typography variant="h6" className={classes.tableContentHeader}>نظرات:</Typography>
                    </Grid>
                </Grid>
            </CollapsibleTableRow>
        );
    });

    const problemRows = problems.length === 0 ? (
        <FullRowCell headersCount={tableHeaderCells.length}>مسئله‌ای یافت نشد.</FullRowCell>
    ) : tableRows;

    return (
        <TableContainer dir="rtl" component={Paper} elevation={4}>
            <Table>
                <TableHead>
                    <TableRow>
                        {tableHeaderCells.map((cell, index) => (
                            <OptionalTableCell key={index} align="right" {...cell}/>
                        ))}
                        <TableCell width={"5%"}/>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        loaded ? problemRows :
                            (
                                <FullRowCell headersCount={tableHeaderCells.length}>
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
        ProblemService.retrieveAuthenticatedOwnerProblems(ProblemState.CREATED)
            .then(value => {
                setOwnerProblems(value.data.content);
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