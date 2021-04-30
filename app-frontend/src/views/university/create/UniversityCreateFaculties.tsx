import {makeStyles} from "@material-ui/core/styles";
import Typography from '@material-ui/core/Typography';
import React from 'react';
import FacultyList from "../../faculty/FacultyList";
import {UniversityCreateSectionsProps} from "./UniversityCreateView";

const useStyles = makeStyles((theme) => ({
    titleWithGutterBottom: {
        margin: theme.spacing(1, 0, 3),
    },
}));

const UniversityCreateFaculties: React.FunctionComponent<UniversityCreateSectionsProps> = (props) => {
    const classes = useStyles();
    const {commonClasses, faculties, setFaculties, errorChecking} = props;

    const isNotBlank = (c: string) => !errorChecking || c.length > 0;

    return (
        <React.Fragment>
            <Typography className={classes.titleWithGutterBottom} variant="h6">
                دانشکده‌ها
            </Typography>
            <FacultyList loaded={true} faculties={faculties}/>
        </React.Fragment>
    );
}

export default UniversityCreateFaculties;