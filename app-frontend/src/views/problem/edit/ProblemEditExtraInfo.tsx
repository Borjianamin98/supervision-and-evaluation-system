import Typography from '@material-ui/core/Typography';
import React from 'react';
import CustomTextField from "../../../components/Text/CustomTextField";
import ProblemStudentService from "../../../services/api/problem/ProblemStudentService";
import {ProblemEditSectionsProps} from "./ProblemEdit";

const ProblemEditExtraInfo: React.FunctionComponent<ProblemEditSectionsProps> = (props) => {
    const {commonClasses, problemSave, updateProblemSave, errorChecking} = props;

    const isDefinitionValid = (definition: string) =>
        !errorChecking || ProblemStudentService.isDefinitionValid(definition);
    const isBlank = (c?: string) => errorChecking && (!c || c.length === 0);

    return (
        <React.Fragment>
            <Typography className={commonClasses.title} variant="h6">
                جزییات مسئله
            </Typography>
            <CustomTextField
                required
                label="تعریف مسئله و نیازمندی"
                maxLength={ProblemStudentService.MAX_LONG_STRING_LENGTH}
                multiline={true}
                rows={4}
                value={problemSave.definition}
                onChange={event => updateProblemSave({...problemSave, definition: event.target.value})}
                helperText={isDefinitionValid(problemSave.definition) ? "" : "تعریف مسئله در حداقل 15 کلمه توضیح داده شود."}
                error={!isDefinitionValid(problemSave.definition)}
            />
            <CustomTextField
                label="پیشینه مسئله"
                multiline={true}
                rows={4}
                value={problemSave.history}
                onChange={event => updateProblemSave({...problemSave, history: event.target.value})}
                maxLength={ProblemStudentService.MAX_LONG_STRING_LENGTH}
            />
            <CustomTextField
                required
                label="ملاحظات"
                maxLength={ProblemStudentService.MAX_LONG_STRING_LENGTH}
                multiline={true}
                rows={4}
                value={problemSave.considerations}
                onChange={event => updateProblemSave({...problemSave, considerations: event.target.value})}
                helperText={isBlank(problemSave.considerations) ? "ملاحضات مسئله باید ذکر شود." : ""}
                error={isBlank(problemSave.considerations)}
            />
        </React.Fragment>
    );
}

export default ProblemEditExtraInfo;