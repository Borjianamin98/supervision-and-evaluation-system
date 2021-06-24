import {Box, Card, CardActions, CardContent, CardProps, Divider} from "@material-ui/core";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Rating from "@material-ui/lab/Rating/Rating";
import moment from "jalali-moment";
import React from 'react';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            borderColor: theme.palette.info.main,
        },
        avatar: {
            backgroundColor: theme.palette.info.main,
        },
        bodyContent: {
            textAlign: "justify",
            whiteSpace: "pre-line",
        },
        cardContent: {
            padding: theme.spacing(1, 2, 0),
        }
    }));

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
                <Rating name="rating" defaultValue={score} readOnly/>
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