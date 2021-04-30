import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import {makeStyles, ThemeProvider} from '@material-ui/core/styles';
import {ClassNameMap} from "@material-ui/core/styles/withStyles";
import Typography from '@material-ui/core/Typography';
import SchoolIcon from '@material-ui/icons/School';
import {AxiosError} from "axios";
import {useSnackbar} from "notistack";
import React, {FormEventHandler, useState} from 'react';
import {rtlTheme} from '../../../App';
import {getGeneralErrorMessage} from "../../../config/axios-config";
import browserHistory from "../../../config/browserHistory";
import {Faculty} from "../../../model/university/faculty";
import {University} from "../../../model/university/university";
import UniversityService from "../../../services/api/university/UniversityService";
import {LOGIN_VIEW_PATH} from "../../ViewPaths";
import UniversityCreateFaculties from "./UniversityCreateFaculties";
import UniversityCreateInfo from "./UniversityCreateInfo";

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(3, 4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    buttonMargin: {
        margin: theme.spacing(0, 0, 2),
    }
}));

const useCommonStyles = makeStyles((theme) => ({
    title: {
        margin: theme.spacing(1, 0),
    },
}));

export interface UniversityCreateSectionsProps {
    commonClasses: ClassNameMap,
    errorChecking: boolean,
    university: University,
    setUniversity: React.Dispatch<React.SetStateAction<University>>,
    faculties: Faculty[],
    setFaculties: React.Dispatch<React.SetStateAction<Faculty[]>>,
}

const UniversityCreateView: React.FunctionComponent = (props) => {
    const classes = useStyles();
    const commonClasses = useCommonStyles();
    const {enqueueSnackbar} = useSnackbar();
    const [university, setUniversity] = useState<University>(UniversityService.createInitialUniversity());
    const [faculties, setFaculties] = useState<Faculty[]>([]);
    const [errorChecking, setErrorChecking] = React.useState(false);

    const sectionProps: UniversityCreateSectionsProps = {
        commonClasses,
        errorChecking,
        university,
        setUniversity,
        faculties,
        setFaculties,
    }

    const formSubmitHandler: FormEventHandler = (event) => {
        event.preventDefault();
    }

    return (
        <ThemeProvider theme={rtlTheme}>
            <Paper dir="rtl" className={classes.root} elevation={6}>
                <Avatar className={classes.avatar}>
                    <SchoolIcon/>
                </Avatar>
                <Typography variant="h5">
                    تعریف دانشگاه
                </Typography>
                <Grid container spacing={3} className={classes.buttonMargin}>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                        <UniversityCreateInfo {...sectionProps}/>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                        <UniversityCreateFaculties {...sectionProps}/>
                    </Grid>
                </Grid>
                <Grid container justify={"center"}>
                    <Grid item>
                        <Button
                            onClick={formSubmitHandler}
                            variant="contained"
                            color="primary"
                        >
                            ایجاد
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        </ThemeProvider>
    );
}

export default UniversityCreateView;