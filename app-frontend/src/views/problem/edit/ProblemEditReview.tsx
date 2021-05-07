import Grid from "@material-ui/core/Grid";
import {makeStyles} from "@material-ui/core/styles";
import Typography from '@material-ui/core/Typography';
import React from 'react';
import KeywordsList from "../../../components/Chip/KeywordsList";
import {educationMapToPersian} from "../../../model/enum/education";
import {ProblemEditSectionsProps} from "./ProblemEdit";

const useStyles = makeStyles((theme) => ({
    gridItem: {
        padding: theme.spacing(2, 0),
    },
}));

const ProblemEditReview: React.FunctionComponent<ProblemEditSectionsProps> = (props) => {
    const classes = useStyles();
    const {commonClasses, problem} = props;

    return (
        <React.Fragment>
            <Grid container alignItems="stretch" justify="center">
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                    <Typography className={commonClasses.title} variant="h6">
                        اطلاعات کلی
                    </Typography>
                    <Grid container alignItems="center">
                        <Grid item xs={12} sm={6} md={6} lg={6} xl={6} className={classes.gridItem}>
                            <Typography variant="h6">دوره تحصیلی:</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={6} xl={6} className={classes.gridItem}>
                            <Typography>{educationMapToPersian(problem.education)}</Typography>
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
                            <KeywordsList keywords={problem.keywords} marginDir="left">
                                کلیدواژه‌ای ارائه نشده است.
                            </KeywordsList>
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={6} xl={6} className={classes.gridItem}>
                            <Typography variant="h6">استاد راهنما:</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={6} xl={6} className={classes.gridItem}>
                            <Typography>
                                {problem.supervisor ?
                                    `${problem.supervisor.firstName} ${problem.supervisor.lastName}` : "استاد راهنما مشخص نشده است."}
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                    <Typography className={commonClasses.title} variant="h6">
                        جزییات مسئله
                    </Typography>
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
                </Grid>
            </Grid>
        </React.Fragment>
    );
}

export default ProblemEditReview;