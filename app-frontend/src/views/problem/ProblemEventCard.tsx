import {Box, Card, CardActions, CardContent, CardHeader, CardProps} from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import HistoryIcon from "@material-ui/icons/History";
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
        justifyAlign: {
            textAlign: "justify"
        },
        cardContent: {
            padding: theme.spacing(0, 2),
        }
    }));

interface ProblemEventCardProps extends CardProps {
    title: string,
    subheader: string,
    body: string,
    date?: string
}

const ProblemEventCard: React.FunctionComponent<ProblemEventCardProps> = (props) => {
    const classes = useStyles();
    const {title, subheader, body, date, ...rest} = props;

    return (
        <Card variant="outlined" {...rest} className={classes.root}>
            <CardHeader
                avatar={
                    <Avatar aria-label="card-type" className={classes.avatar}>
                        <HistoryIcon/>
                    </Avatar>
                }
                title={title}
                subheader={subheader}
            />
            <CardContent classes={{
                root: classes.cardContent,
            }}>
                <Typography variant="body2" color="textSecondary" className={classes.justifyAlign}>
                    {body}
                </Typography>
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

export default ProblemEventCard;