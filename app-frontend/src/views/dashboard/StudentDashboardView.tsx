import Grid from "@material-ui/core/Grid";
import React from 'react';
import addProblemImage from "../../assets/images/problem/add-prbolem.jpg";
import viewProblemImage from "../../assets/images/problem/view-problem.jpg";
import ButtonLink from "../../components/Button/ButtonLink";
import MediaCard from "../../components/MediaCard/MediaCard";
import {PROBLEM_EDIT_VIEW_PATH, PROBLEM_LIST_VIEW_PATH} from "../ViewPaths";

const StudentDashboardView: React.FunctionComponent = () => {
    return (
        <Grid container dir="rtl">
            <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                <MediaCard
                    media={addProblemImage}
                    title="افزودن پایان‌نامه (پروژه)"
                    subTitle={["پایان‌نامه یا پروژه‌ی دوره تحصیلی خود را برای ارائه نمودن اضافه نمایید."]}
                >
                    <ButtonLink to={PROBLEM_EDIT_VIEW_PATH} color="primary">
                        ایجاد
                    </ButtonLink>
                </MediaCard>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                <MediaCard
                    media={viewProblemImage}
                    title="مشاهده پایان‌نامه‌ها (پروژه‌ها)"
                    subTitle={["پایان‌نامه‌ها (پروژه‌ها) افزوده‌شده و در حال پیگیری را مشاهده نمایید."]}
                >
                    <ButtonLink to={PROBLEM_LIST_VIEW_PATH} color="primary">
                        مشاهده
                    </ButtonLink>
                </MediaCard>
            </Grid>
        </Grid>
    );
}

export default StudentDashboardView;