import {makeStyles} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import React from 'react';
import facultyViewImage from "../../assets/images/faculty/faculty-view.jpg";
import universityViewImage from "../../assets/images/university/university-view.jpg";
import ButtonLink from "../../components/Button/ButtonLink";
import MediaCard from "../../components/MediaCard/MediaCard";
import {FACULTY_LIST_VIEW_PATH, UNIVERSITY_LIST_VIEW_PATH} from "../ViewPaths";

const useStyles = makeStyles((theme) => ({
    mediaCard: {
        margin: theme.spacing(1)
    },
}));

const AdminDashboardView: React.FunctionComponent = () => {
    const classes = useStyles();

    return (
        <Grid container dir="rtl">
            <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                <MediaCard
                    className={classes.mediaCard}
                    media={universityViewImage}
                    title="دانشگاه‌ها"
                    subTitle="دانشگاه‌ها و اطلاعات مربوط به آن‌ها را مشاهده و مدیریت کنید."
                >
                    <ButtonLink to={UNIVERSITY_LIST_VIEW_PATH} color="primary">
                        مشاهده
                    </ButtonLink>
                </MediaCard>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                <MediaCard
                    className={classes.mediaCard}
                    media={facultyViewImage}
                    title="دانشکده‌ها"
                    subTitle="دانشکده‌ها و اطلاعات مربوط به آن‌ها را مشاهده و مدیریت کنید."
                >
                    <ButtonLink to={FACULTY_LIST_VIEW_PATH} color="primary">
                        مشاهده
                    </ButtonLink>
                </MediaCard>
            </Grid>
        </Grid>
    );
}

export default AdminDashboardView;