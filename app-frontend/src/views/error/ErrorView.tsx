import {Button, makeStyles, Theme} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import createStyles from "@material-ui/core/styles/createStyles";
import Typography from "@material-ui/core/Typography";
import CloudIcon from '@material-ui/icons/Cloud';
import {useSnackbar} from "notistack";
import React from 'react';
import browserHistory from "../../config/browserHistory";
import ActuatorService from "../../services/api/ActuatorService";
import {DASHBOARD_VIEW_PATH} from "../ViewPaths";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            minHeight: '100vh',
            textAlign: "center",
        },
        item: {
            margin: theme.spacing(2)
        }
    }),
);

const ErrorView: React.FunctionComponent = () => {
    const classes = useStyles();
    const {enqueueSnackbar} = useSnackbar();

    function tryAgainHandler() {
        ActuatorService.isServerUp()
            .then(() => browserHistory.push(DASHBOARD_VIEW_PATH))
            .catch(() => enqueueSnackbar("سامانه همچنان در دسترس نمی‌باشد.", {variant: "error"}))
    }

    return (
        <Grid container
              direction="column"
              dir="rtl"
              justify="center"
              alignItems="center"
              className={classes.root}
        >
            <Grid item xs={12}>
                <CloudIcon color="primary" style={{fontSize: 200}}/>
            </Grid>
            <Grid item xs={12} className={classes.item}>
                <Typography>در ارتباط با سرور مشکلی می‌باشد. در صورت عدم رفع مشکل با مسئول پشتیبانی تماس
                    بگیرید.</Typography>
            </Grid>
            <Grid item xs={12} className={classes.item}>
                <Button onClick={tryAgainHandler} variant="contained" color="primary">
                    تلاش دوباره
                </Button>
            </Grid>
        </Grid>
    );
}

export default ErrorView;