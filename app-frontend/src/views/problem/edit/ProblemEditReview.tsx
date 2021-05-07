import Typography from '@material-ui/core/Typography';
import React from 'react';
import {ProblemEditSectionsProps} from "./ProblemEdit";

const ProblemEditReview: React.FunctionComponent<ProblemEditSectionsProps> = (props) => {
    const {commonClasses, problem, updateProblem, errorChecking} = props;

    return (
        <React.Fragment>
            <Typography className={commonClasses.title} variant="h6">
                بازبینی
            </Typography>
        </React.Fragment>
    );
}

export default ProblemEditReview;