import {makeStyles} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import React from 'react';
import facultyViewImage from "../../assets/images/faculty/faculty-view.jpg";
import universityViewImage from "../../assets/images/university/university-view.jpg";
import UserInfoImage from "../../assets/images/user/UserInfo.jpg";
import ButtonLink from "../../components/Button/ButtonLink";
import MediaCard from "../../components/MediaCard/MediaCard";
import {FACULTY_LIST_VIEW_PATH, PROFILE_VIEW_PATH, UNIVERSITY_LIST_VIEW_PATH} from "../ViewPaths";

const AdminDashboardView: React.FunctionComponent = () => {
    return (
        <Grid container dir="rtl">
            <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                <MediaCard
                    media={universityViewImage}
                    title="دانشگاه‌ها"
                    subTitle={["دانشگاه‌ها و اطلاعات مربوط به آن‌ها را مشاهده و مدیریت کنید."]}
                >
                    <ButtonLink to={UNIVERSITY_LIST_VIEW_PATH} color="primary">
                        مشاهده
                    </ButtonLink>
                </MediaCard>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                <MediaCard
                    media={facultyViewImage}
                    title="دانشکده‌ها"
                    subTitle={["دانشکده‌ها و اطلاعات مربوط به آن‌ها را مشاهده و مدیریت کنید."]}
                >
                    <ButtonLink to={FACULTY_LIST_VIEW_PATH} color="primary">
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

export default AdminDashboardView;