import {Paper} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import {makeStyles, ThemeProvider} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import React from 'react';
import {rtlTheme} from "../../../App";

const useStyles = makeStyles((theme) => ({
    paper: {
        margin: theme.spacing(1),
        padding: theme.spacing(3),
        display: 'flex',
        flexGrow: 1,
        flexDirection: 'column',
    },
}));

const GeneralInfo: React.FunctionComponent = () => {
    const classes = useStyles();

    return (
        <Grid dir="rtl" container>
            <Grid item sm={12} md={6}>
                <Paper square elevation={3} className={classes.paper}>
                    توضیحات کلی
                </Paper>
            </Grid>
            <Grid item sm={12} md={6}>
                <Paper square elevation={3} className={classes.paper}>
                    <ThemeProvider theme={rtlTheme}>
                        <TextField
                            dir="rtl"
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="عنوان فارسی"
                            // placeholder="عنوان فارسی"
                            helperText="خطا عنوان فارسی باید وارد شود!"
                            error
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </ThemeProvider>
                </Paper>
            </Grid>
        </Grid>
    );
}

export default GeneralInfo;