import Grid from "@material-ui/core/Grid";
import React from 'react';
import viewProblemImage from "../../assets/images/problem/view-problem.jpg";
import UserInfoImage from "../../assets/images/user/UserInfo.jpg";
import ButtonLink from "../../components/Button/ButtonLink";
import MediaCard from "../../components/MediaCard/MediaCard";
import {PROBLEM_LIST_VIEW_PATH, PROFILE_VIEW_PATH} from "../ViewPaths";

const MasterDashboardView: React.FunctionComponent = () => {
    return (
        <Grid container dir="rtl">
            <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                <MediaCard
                    media={viewProblemImage}
                    title="مشاهده پایان‌نامه‌ها (پروژه‌ها)"
                    subTitle={[
                        "پایان‌نامه‌ها (پروژه‌ها) که مربوط به شما هستند را مشاهده نمایید.",
                        "پروژه‌ها شامل مواردی هستند که شما استاد راهنما یا داور آن باشد."
                    ]}
                >
                    <ButtonLink to={PROBLEM_LIST_VIEW_PATH} color="primary">
                        مشاهده
                    </ButtonLink>
                </MediaCard>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                <MediaCard
                    media={UserInfoImage}
                    title="حساب کاربری"
                    subTitle={[
                        "اطلاعات حساب کاربری خود را از بخش مربوطه مشاهده نمایید.",
                        "برای اطلاعات بیش‌تر به بخش مربوطه مراجعه کنید."
                    ]}
                >
                    <ButtonLink to={PROFILE_VIEW_PATH} color="primary">
                        مشاهده
                    </ButtonLink>
                </MediaCard>
            </Grid>
        </Grid>
    );
}

export default MasterDashboardView;