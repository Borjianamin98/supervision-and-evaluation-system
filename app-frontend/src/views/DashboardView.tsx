import {Card, CardMedia, makeStyles} from "@material-ui/core";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from '@material-ui/core/CardActions';
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import React from 'react';
import addDocumentImage from "../assets/images/dashboard/add-document.jpg";
import ButtonLink from "../components/Button/ButtonLink";
import {PROBLEM_CREATE_VIEW_PATH, PROBLEM_VIEW_PATH} from "./ViewPaths";

const useStyles = makeStyles({
    root: {
        maxWidth: 345,
    },
});

const DashboardView: React.FunctionComponent = () => {
    const classes = useStyles();

    return (
        <div dir="rtl" style={{display: "flex", flexGrow: 0}}>
            <Card className={classes.root}>
                <CardActionArea>
                    <CardMedia
                        component="img"
                        alt="Add problem"
                        height="140"
                        image={addDocumentImage}
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5">
                            افزودن مسئله
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            مسئله دوره تحصیلی خود را برای ارائه نمودن اضافه نمایید.
                        </Typography>
                    </CardContent>
                </CardActionArea>
                <CardActions>
                    <ButtonLink to={PROBLEM_CREATE_VIEW_PATH} size="small" color="primary">
                        ایجاد
                    </ButtonLink>
                    <ButtonLink to={PROBLEM_VIEW_PATH} size="small" color="primary">
                        مشاهده
                    </ButtonLink>
                </CardActions>
            </Card>
        </div>
    )
        ;
}

export default DashboardView;