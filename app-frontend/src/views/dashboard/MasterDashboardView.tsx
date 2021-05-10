import {makeStyles} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import React from 'react';
import viewProblemImage from "../../assets/images/problem/view-problem.jpg";
import ButtonLink from "../../components/Button/ButtonLink";
import MediaCard from "../../components/MediaCard/MediaCard";
import {PROBLEM_LIST_VIEW_PATH} from "../ViewPaths";

const useStyles = makeStyles((theme) => ({
    mediaCard: {
        margin: theme.spacing(1)
    },
}));

const MasterDashboardView: React.FunctionComponent = () => {
    const classes = useStyles();

    return (
        <Grid container dir="rtl">
            <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                <MediaCard
                    className={classes.mediaCard}
                    media={viewProblemImage}
                    title="مشاهده پایان‌نامه‌ها (پروژه‌ها)"
                    subTitle={[
                        "پایان‌نامه‌ها (پروژه‌ها) که مربوط به شما هستند را مشاهده نمایید.",
                        "پروژه‌ها شامل مواردی هستند که شما استاد راهنمای آن می‌باشید یا داور مشخص‌شده برای آن باشید."
                    ]}
                >
                    <ButtonLink to={PROBLEM_LIST_VIEW_PATH} color="primary">
                        مشاهده
                    </ButtonLink>
                </MediaCard>
            </Grid>
        </Grid>
    );
}

export default MasterDashboardView;