import {Card, CardMedia, makeStyles} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from '@material-ui/core/CardActions';
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import React from 'react';
import addDocumentImage from "../assets/images/dashboard/add-document.jpg";

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
                        alt="Add project"
                        height="140"
                        image={addDocumentImage}
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5">
                            افزودن پروژه
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            پروژه‌ی دوره تحصیلی خود را برای ارائه نمودن اضافه نمایید.
                        </Typography>
                    </CardContent>
                </CardActionArea>
                <CardActions>
                    <Button size="small" color="primary">
                        اضافه کردن
                    </Button>
                    <Button size="small" color="primary">
                        مشاهده لیست
                    </Button>
                </CardActions>
            </Card>
        </div>
    )
        ;
}

export default DashboardView;