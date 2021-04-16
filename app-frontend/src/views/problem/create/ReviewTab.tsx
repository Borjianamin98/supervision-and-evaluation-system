import Chip from "@material-ui/core/Chip";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import {makeStyles, ThemeProvider} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import classNames from "classnames";
import React from 'react';
import {rtlTheme} from "../../../App";
import {ProblemTabProps} from "./ProblemCreateView";

const useStyles = makeStyles((theme) => ({
    gridItem: {
        padding: theme.spacing(2),
    },
    chip: {
        margin: theme.spacing(1),
    }
}));

const ReviewTab: React.FunctionComponent<ProblemTabProps> = ({commonClasses, problem, setProblem}) => {
    const classes = useStyles();

    return (
        <Grid container dir="rtl" alignItems="stretch">
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <Paper square elevation={3} className={commonClasses.paper}>
                    <ThemeProvider theme={rtlTheme}>
                        <Grid container alignItems="center">
                            <Grid item xs={12} sm={6} md={6} lg={6} xl={6} className={classes.gridItem}>
                                <Typography variant="h6">دوره تحصیلی:</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={6} xl={6} className={classes.gridItem}>
                                <Typography>{problem.education}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={6} xl={6} className={classes.gridItem}>
                                <Typography variant="h6">عنوان فارسی:</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={6} xl={6} className={classes.gridItem}>
                                <Typography>
                                    {problem.title.length === 0 ? "عنوانی مشخص نشده است." : problem.title}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={6} xl={6} className={classes.gridItem}>
                                <Typography variant="h6">عنوان انگلیسی:</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={6} xl={6} className={classes.gridItem}>
                                <Typography>
                                    {problem.englishTitle.length === 0 ? "عنوانی مشخص نشده است." : problem.englishTitle}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={6} xl={6} className={classes.gridItem}>
                                <Typography variant="h6">کلیدواژه‌ها:</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={6} xl={6} className={classes.gridItem}>
                                {problem.keywords.length === 0 ? "کلیدواژه‌ای ارائه نشده است." :
                                    (problem.keywords.map(keyword => <Chip
                                        variant="outlined" color="primary"
                                        className={classes.chip}
                                        label={keyword}/>
                                    ))}
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={6} xl={6} className={classes.gridItem}>
                                <Typography variant="h6">استاد راهنما:</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={6} xl={6} className={classes.gridItem}>
                                <Typography>
                                    {problem.supervisor && problem.supervisor?.length > 0 ?
                                        problem.supervisor : "استاد راهنما مشخص نشده است."}
                                </Typography>
                            </Grid>
                        </Grid>
                    </ThemeProvider>
                </Paper>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <Paper square elevation={3} className={commonClasses.paper}>
                    <ThemeProvider theme={rtlTheme}>
                        <Typography className={classes.gridItem} variant="h6">تعریف مسئله و نیازمندی</Typography>
                        <Typography className={classes.gridItem}>
                            {problem.definition.length === 0 ? "تعریف مسئله مشخص نشده است." : problem.englishTitle}
                        </Typography>
                        <Typography className={classes.gridItem} variant="h6">پیشینه مسئله</Typography>
                        <Typography className={classes.gridItem}>
                            {problem.history && problem.history?.length > 0 ?
                                problem.history : "بیشینه ارائه نشده است."}
                        </Typography>
                        <Typography className={classes.gridItem} variant="h6">ملاحظات</Typography>
                        <Typography className={classes.gridItem}>
                            {problem.considerations && problem.considerations?.length > 0 ?
                                problem.considerations : "ملاحظات ارائه نشده است."}
                        </Typography>
                    </ThemeProvider>
                </Paper>
            </Grid>
        </Grid>
    );
}

export default ReviewTab;