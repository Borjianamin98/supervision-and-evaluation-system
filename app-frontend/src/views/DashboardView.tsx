import {makeStyles} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import React from 'react';
import addProblemImage from "../assets/images/problem/add-prbolem.jpg";
import viewProblemImage from "../assets/images/problem/view-problem.jpg";
import ButtonLink from "../components/Button/ButtonLink";
import MediaCard from "../components/MediaCard/MediaCard";
import {PROBLEM_CREATE_VIEW_PATH, PROBLEM_OBSERVATION_PATH} from "./ViewPaths";

const useStyles = makeStyles((theme) => ({
    root: {
        // maxWidth: 345,
    },
    mediaCard: {
        margin: theme.spacing(1)
    },
}));

const DashboardView: React.FunctionComponent = () => {
    const classes = useStyles();

    return (
        <Grid container dir="rtl">
            <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                <MediaCard
                    className={classes.mediaCard}
                    media={addProblemImage}
                    title="افزودن مسئله"
                    subTitle="مسئله دوره تحصیلی خود را برای ارائه نمودن اضافه نمایید."
                >
                    <ButtonLink to={PROBLEM_CREATE_VIEW_PATH} color="primary">
                        ایجاد
                    </ButtonLink>
                </MediaCard>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                <MediaCard
                    className={classes.mediaCard}
                    media={viewProblemImage}
                    title="مشاهده مسائل"
                    subTitle="مسئله‌های افزوده‌شده و در حال پیگیری را مشاهده نمایید."
                >
                    <ButtonLink to={PROBLEM_OBSERVATION_PATH} color="primary">
                        مشاهده
                    </ButtonLink>
                </MediaCard>
            </Grid>
        </Grid>
    );
}

export default DashboardView;