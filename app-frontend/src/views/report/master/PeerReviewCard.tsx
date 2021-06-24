import {Box, Card, CardActions, CardContent, CardProps, Divider} from "@material-ui/core";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Rating from "@material-ui/lab/Rating/Rating";
import moment from "jalali-moment";
import React from 'react';
import CenterBox from "../../../components/Grid/CenterBox";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            borderColor: theme.palette.info.main,
        },
        bodyContent: {
            textAlign: "justify",
            whiteSpace: "pre-line",
        },
        cardContent: {
            padding: theme.spacing(1, 2, 0),
        }
    }));

const labels: { [index: string]: string } = {
    0: "نادقیق",
    1: "خیلی ضعیف",
    2: "ضعیف",
    3: "متوسط",
    4: "خوب",
    5: "عالی",
};

interface PeerReviewCardProps extends CardProps {
    content: string,
    score: number,
    date?: string
}

const PeerReviewCard: React.FunctionComponent<PeerReviewCardProps> = (props) => {
    const classes = useStyles();
    const {content, score, date, ...rest} = props;

    return (
        <Card variant="outlined" {...rest} className={classes.root}>
            <CardContent classes={{
                root: classes.cardContent,
            }}>
                <CenterBox flexDirection={"row"} justifyContent={"flex-start"} marginBottom={1}>
                    <Rating name="rating" defaultValue={score} readOnly/>
                    <Box ml={2}>{labels[score]}</Box>
                </CenterBox>
                <Divider/>
                <Box marginTop={1}>
                    <Typography variant="body2" color="textSecondary" className={classes.bodyContent}>
                        {content}
                    </Typography>
                </Box>
            </CardContent>
            <CardActions>
                <Box marginLeft="auto">
                    <Typography color="textSecondary" variant="caption">
                        {date ? moment(date).locale('fa').format('ddd، D MMMM YYYY (h:mm a)') : ""}
                    </Typography>
                </Box>
            </CardActions>
        </Card>
    );
}

export default PeerReviewCard;