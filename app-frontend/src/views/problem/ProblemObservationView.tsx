import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import {makeStyles} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import {useSnackbar} from "notistack";
import React from 'react';
import KeywordsList from "../../components/Chip/KeywordsList";
import CollapsibleTableRow from "../../components/Table/CollapsibleTableRow";
import OptionalTableCell, {OptionalTableCellProps} from "../../components/Table/OptionalTableCell";
import {getGeneralErrorMessage} from "../../config/axios-config";
import {educationEnglishMapping, Problem} from "../../model/problem";
import ProblemService from "../../services/api/ProblemService";

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(3),
    },
    header: {
        margin: theme.spacing(3, 0),
    },
    rtl: {
        textAlign: "right",
    },
}));

const CollapsibleTable: React.FunctionComponent<{ problems: Array<Problem> }> = (props) => {
    const classes = useStyles();
    const {problems} = props;

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
                <Typography className={classes.rtl} variant="h6" gutterBottom component="div">
                    اطلاعات بیش‌تر
                </Typography>
            </CollapsibleTableRow>
        );
    });

    return (
        <TableContainer dir="rtl" component={Paper}>
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
                        problems.length === 0 ? (
                            <TableRow>
                                <TableCell align="center" colSpan={tableHeaderCells.length + 1}>مسئله‌ای یافت نشد.</TableCell>
                            </TableRow>
                        ) : (
                            tableRows
                        )
                    }
                </TableBody>
            </Table>
        </TableContainer>
    );
}

const ProblemObservationView: React.FunctionComponent = () => {
    const classes = useStyles();
    const [newProblems, setNewProblems] = React.useState<Problem[]>([]);
    const {enqueueSnackbar} = useSnackbar();

    React.useEffect(() => {
        ProblemService.retrieveOwnerProblem()
            .then(value => setNewProblems(value.data))
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
        <Paper elevation={6} variant="outlined" square className={classes.root}>
            <Typography dir="rtl" variant="h6" className={classes.header}>
                مسئله‌های جدید
            </Typography>
            <CollapsibleTable problems={newProblems}/>
            <Typography dir="rtl" variant="h6" className={classes.header}>
                مسئله‌های در حال پیگیری
            </Typography>
            <Typography dir="rtl" variant="h6" className={classes.header}>
                مسئله‌های اتمام‌یافته
            </Typography>
        </Paper>
    );
}

export default ProblemObservationView;