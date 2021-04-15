import {Paper, Tab, Tabs} from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Grid from "@material-ui/core/Grid";
import {makeStyles, ThemeProvider} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import React from 'react';
import SwipeableViews from "react-swipeable-views";
import {rtlTheme} from "../../../App";
import TabPanel from "./TabPanel";

const useStyles = makeStyles((theme) => ({
    paper: {
        margin: theme.spacing(1),
        padding: theme.spacing(3),
        display: 'flex',
        flexGrow: 1,
        flexDirection: 'column',
    },
}));

const ProblemCreateView: React.FunctionComponent = () => {
    const classes = useStyles();
    const [tabIndex, setTabIndex] = React.useState(0);

    const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setTabIndex(newValue);
    };

    const handleChangeIndex = (index: number) => {
        setTabIndex(index);
    };

    return (
        <div>
            <AppBar position="static">
                <Tabs
                    dir="rtl"
                    value={tabIndex}
                    onChange={handleTabChange}
                    centered
                    aria-label="tabs"
                    indicatorColor="secondary"
                >
                    <Tab label="اطلاعات کلی"/>
                    <Tab label="اطلاعات تکمیلی"/>
                    <Tab label="بازبینی"/>
                </Tabs>
            </AppBar>
            <SwipeableViews
                axis="x-reverse"
                index={tabIndex}
                onChangeIndex={handleChangeIndex}
            >
                <TabPanel value={tabIndex} index={0}>
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
                </TabPanel>
                <TabPanel value={tabIndex} index={1}>
                    <Typography dir="rtl">اطلاعات تکمیلی</Typography>
                </TabPanel>
                <TabPanel value={tabIndex} index={2}>
                    <Typography dir="rtl">بازبینی</Typography>
                </TabPanel>
            </SwipeableViews>
        </div>
    );
}

export default ProblemCreateView;