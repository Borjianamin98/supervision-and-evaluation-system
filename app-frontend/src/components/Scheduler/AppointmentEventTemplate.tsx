import {Box, BoxProps, Grow, IconButton} from "@material-ui/core";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/Delete";
import React from 'react';
import {SyncfusionSchedulerEvent} from "../../model/schedule/ScheduleEvent";
import CenterBox from "../Grid/CenterBox";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        backdrop: {
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            position: "absolute",
            right: 0,
            bottom: 0,
            top: 0,
            left: 0,
        },
        appointment: {
            textAlign: "center",
            overflow: "hidden",
        },
    }),
);

const AppointmentEventTemplate = (props: SyncfusionSchedulerEvent) => {
    const classes = useStyles();
    const [isBackdrop, setIsBackdrop] = React.useState(false);

    const appointmentClick: BoxProps["onClick"] = (event) => {
        event.stopPropagation(); // Suppress scheduler events
        setIsBackdrop(prevState => !prevState);
    }

    return (
        <Box dir="rtl" padding={1} style={{height: "100%"}} onClick={appointmentClick}>
            <Typography variant="body2" className={classes.appointment}>
                {props.subject}
            </Typography>
            <Grow in={isBackdrop}>
                <CenterBox className={classes.backdrop}>
                    <IconButton aria-label="delete" color="inherit">
                        <DeleteIcon fontSize="small"/>
                    </IconButton>
                </CenterBox>
            </Grow>
        </Box>
    );
}

export default AppointmentEventTemplate;