import Typography from '@material-ui/core/Typography';
import React from 'react';
import CustomTextField from "../../../components/Text/CustomTextField";
import ProblemService from "../../../services/api/ProblemService";
import {ProblemEditSectionsProps} from "./ProblemEdit";

const ProblemEditExtraInfo: React.FunctionComponent<ProblemEditSectionsProps> = (props) => {
    const {commonClasses, problem, updateProblem, errorChecking} = props;

    const isDefinitionValid = (definition: string) =>
        !errorChecking || ProblemService.isDefinitionValid(definition);
    const isBlank = (c?: string) => errorChecking && (!c || c.length === 0);

    return (
        <React.Fragment>
            <Typography className={commonClasses.title} variant="h6">
                جزییات مسئله
            </Typography>
            <CustomTextField
                required
                label="تعریف مسئله و نیازمندی"
                maxLength={ProblemService.MAX_LONG_STRING_LENGTH}
                multiline={true}
                rowsMax={4}
                value={problem.definition}
                onChange={event => updateProblem({...problem, definition: event.target.value})}
                helperText={isDefinitionValid(problem.definition) ? "" : "تعریف مسئله در حداقل 15 کلمه توضیح داده شود."}
                error={!isDefinitionValid(problem.definition)}
            />
            <CustomTextField
                label="پیشینه مسئله"
                multiline={true}
                rowsMax={4}
                value={problem.history}
                onChange={event => updateProblem({...problem, history: event.target.value})}
                maxLength={ProblemService.MAX_LONG_STRING_LENGTH}
            />
            <CustomTextField
                required
                label="ملاحظات"
                maxLength={ProblemService.MAX_LONG_STRING_LENGTH}
                multiline={true}
                rowsMax={4}
                value={problem.considerations}
                onChange={event => updateProblem({...problem, considerations: event.target.value})}
                helperText={isBlank(problem.considerations) ? "ملاحضات مسئله باید ذکر شود." : ""}
                error={isBlank(problem.considerations)}
            />
        </React.Fragment>
    );
}

export default ProblemEditExtraInfo;