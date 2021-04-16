import {Chip, Paper} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import {makeStyles, ThemeProvider} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Autocomplete from '@material-ui/lab/Autocomplete';
import React from 'react';
import {rtlTheme} from "../../../App";
import CustomTextField from "../../../components/Text/CustomTextField";

const useStyles = makeStyles((theme) => ({
    paper: {
        margin: theme.spacing(1),
        padding: theme.spacing(3),
        display: 'flex',
        flexGrow: 1,
        flexDirection: 'column',
    },
    typography: {
        margin: theme.spacing(1, 0, 0, 0),
    },
    option: {
        direction: "rtl",
    }
}));


const GeneralInfo: React.FunctionComponent = () => {
    const classes = useStyles();

    const educations = ["کارشناسی", "کارشناسی ارشد"];
    const [education, setEducation] = React.useState(educations[0])

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
                        <Typography className={classes.typography} variant="h5">
                            دوره تحصیلی
                        </Typography>
                        <Autocomplete
                            options={educations}
                            disableClearable
                            value={education}
                            onChange={(event, value) => setEducation(value)}
                            style={{width: 300}}
                            classes={{
                                option: classes.option,
                            }}
                            renderInput={(params) =>
                                <CustomTextField
                                    {...params}
                                    extraInputProps={{autoComplete: 'new-password'}}
                                    label="دوره تحصیلی"
                                />}
                        />
                        <Typography className={classes.typography} variant="h5">
                            مسئله
                        </Typography>
                        <CustomTextField label="عنوان فارسی" required/>
                        <CustomTextField textDirection="ltr" label="عنوان انگلیسی" required/>
                        <Autocomplete
                            multiple
                            options={[]}
                            limitTags={3}
                            id="tags"
                            freeSolo
                            renderTags={(value: string[], getTagProps) =>
                                value.map((option: string, index: number) => (
                                    <Chip variant="outlined" label={option} {...getTagProps({index})} />
                                ))
                            }
                            renderInput={(params) => (
                                <CustomTextField
                                    {...params}
                                    extraInputProps={{autoComplete: 'new-password'}}
                                    label="کلیدواژه"
                                />
                            )}
                        />
                        <Typography className={classes.typography} variant="h5">
                            استاد
                        </Typography>
                        <CustomTextField label="استاد راهنما" required/>
                    </ThemeProvider>
                </Paper>
            </Grid>
        </Grid>
    );
}

export default GeneralInfo;