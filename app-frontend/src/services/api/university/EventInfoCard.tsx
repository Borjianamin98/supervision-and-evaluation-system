import {Box, Card, CardActions, CardContent, CardProps} from "@material-ui/core";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import moment from "jalali-moment";
import React from 'react';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        justifyAlign: {
            textAlign: "justify"
        },
    }));

interface InfoCardProps extends CardProps {
    header: string,
    body: string,
    date?: string
}

const EventInfoCard: React.FunctionComponent<InfoCardProps> = (props) => {
    const classes = useStyles();
    const {header, body, date, ...rest} = props;

    return (
        <Card variant="outlined" {...rest}>
            <CardContent>
                <Typography color="textSecondary" paragraph>
                    {header}
                </Typography>
                <Typography variant="body1" className={classes.justifyAlign}>
                    {body}
                </Typography>
            </CardContent>
            <CardActions>
                <Box marginLeft="auto">
                    <Typography color="textSecondary" variant="subtitle2">
                        {date ? moment(date).locale('fa').format('ddd، D MMMM YYYY (h:mm a)') : ""}
                    </Typography>
                </Box>
            </CardActions>
        </Card>
    );
}

export default EventInfoCard;