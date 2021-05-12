import {Box, Grid, Paper} from "@material-ui/core";
import {createStyles, makeStyles, Theme, ThemeProvider} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import moment from "jalali-moment";
import React from 'react';
import {rtlTheme} from "../../App";
import CustomAlert from "../../components/Alert/CustomAlert";
import HistoryInfoAlert from "../../components/Alert/HistoryInfoAlert";
import KeywordsList from "../../components/Chip/KeywordsList";
import {educationMapToPersian} from "../../model/enum/education";
import {ProblemEvent} from "../../model/problem/problemEvent";
import ProblemStudentService from "../../services/api/problem/ProblemStudentService";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        innerOnePadding: {
            padding: theme.spacing(1),
        },
        column: {
            padding: theme.spacing(0, 1),
        },
        upDownMargin: {
            margin: theme.spacing(1, 0),
        },
        avatar: {
            width: 140,
            height: 140,
        },
        centerAlign: {
            textAlign: "center"
        },
    }),
);

const ProblemManagementView: React.FunctionComponent = () => {
    const classes = useStyles();
    const [problem, setProblem] = React.useState(ProblemStudentService.createInitialProblem());

    const events = problem.events.sort((a, b) =>
        new Date(a.createdDate!).valueOf() - new Date(b.createdDate!).valueOf())
        .reverse()
        .slice(0, 10)
        .map((event: ProblemEvent) =>
            <HistoryInfoAlert
                key={event.id!}
                className={classes.upDownMargin}
            >
                {event.createdBy}
                {"، "}
                {moment(event.createdDate!).locale('fa').format('ddd، D MMMM YYYY (h:mm a)')}
                {": "}
                {event.message}
            </HistoryInfoAlert>
        )

    return (
        <ThemeProvider theme={rtlTheme}>
            <Grid dir="rtl" container direction="row">
                <Grid item xs={12} sm={12} md={4} lg={4} xl={4} className={classes.column}>
                    <Paper className={classes.innerOnePadding}>
                        <Typography variant="h6">
                            اطلاعات کلی
                        </Typography>
                        <Typography paragraph>
                            {`دوره تحصیلی: ${educationMapToPersian(problem.education)}`}
                        </Typography>
                        <Typography paragraph>{`عنوان: ${problem.title}`}</Typography>
                        <Typography paragraph>{`عنوان انگلیسی: ${problem.englishTitle}`}</Typography>
                        <Typography paragraph component="span">کلیدواژه‌ها: </Typography>
                        <Box marginBottom={2}>
                            <KeywordsList keywords={problem.keywords} marginDir="left"/>
                        </Box>
                        <Typography paragraph>{`تعریف: ${problem.definition}`}</Typography>
                        <Typography paragraph>{`بیشینه: ${problem.history}`}</Typography>
                        <Typography paragraph>{`ملاحظات: ${problem.considerations}`}</Typography>
                        <Typography paragraph>
                            {"استاد راهنما: "}
                            {problem.supervisor?.fullName ?? ""}
                        </Typography>
                    </Paper>
                </Grid>
                <Grid container item direction="column" xs={12} sm={12} md={4} lg={4} xl={4} className={classes.column}>
                    <Paper className={classes.innerOnePadding}>
                        <Typography variant="h6">
                            رخدادهای اخیر
                        </Typography>
                        {events.length !== 0 ? events :
                            <CustomAlert variant="outlined" severity="info"
                                         className={classes.upDownMargin}>
                                هیچ رخدادی وجود ندارد.
                            </CustomAlert>}
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4} xl={4} className={classes.column}>
                    <Paper className={classes.innerOnePadding}>
                        بخش اساتید
                    </Paper>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
}

export default ProblemManagementView;