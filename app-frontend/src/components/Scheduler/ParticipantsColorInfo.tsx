import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import classNames from 'classnames';
import React from 'react';
import {Participant} from "./CustomScheduler";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: theme.spacing(1, 0),
        },
    }),
);


interface ParticipantColorInfoProps {
    participants: Participant[]
}

const ParticipantsColorInfo: React.FunctionComponent<ParticipantColorInfoProps> = (props) => {
    const classes = useStyles();
    const {participants} = props;

    return <Grid
        container alignItems="center" justify="space-around"
        className={classNames(classes.root, "e-schedule", "e-schedule-toolbar")}
    >
        {
            participants.map(participant => {
                return <Box
                    key={participant.id}
                    display="flex"
                    flexDirection="row-reverse"
                    alignItems="center"
                >
                    <Avatar style={{backgroundColor: participant.color}}/>
                    <Box margin={1}>
                        <Typography>{participant.name}</Typography>
                    </Box>
                </Box>
            })
        }
    </Grid>
}

export default ParticipantsColorInfo;