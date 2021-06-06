import {Chip} from "@material-ui/core";
import Typography from '@material-ui/core/Typography';
import Autocomplete from "@material-ui/lab/Autocomplete";
import React from 'react';
import CustomAlert from "../../../components/Alert/CustomAlert";
import AsynchronousComboBox from "../../../components/ComboBox/AsynchronousComboBox";
import ComboBox from "../../../components/ComboBox/ComboBox";
import {VirtualizedListBoxComponent, VirtualizedListBoxStyles} from "../../../components/ComboBox/VirtualizedComboBox";
import CustomTextField from "../../../components/Text/CustomTextField";
import {educationMapToEnglish, educationMapToPersian, PERSIAN_EDUCATIONS} from "../../../model/enum/education";
import {Master} from "../../../model/user/master";
import ProblemStudentService from "../../../services/api/problem/ProblemStudentService";
import MasterService from "../../../services/api/user/MasterService";
import {EditState, ProblemEditSectionsProps} from "./ProblemEdit";

const ProblemEditGeneralInfo: React.FunctionComponent<ProblemEditSectionsProps> = (props) => {
    const {
        commonClasses,
        editState,
        problemSave,
        updateProblemSave,
        selectedSupervisor,
        updateSelectedSupervisor,
        errorChecking
    } = props;

    const isKeywordsValid = (definition: string[]) =>
        !errorChecking || ProblemStudentService.isKeywordsValid(definition);
    const isBlank = (c?: string) => errorChecking && (!c || c.length === 0);
    const isNull = <T extends {}>(c?: T) => errorChecking && !c;

    function retrieveMasters(inputValue: string): Promise<Master[]> {
        return MasterService.retrieveMasters(100, 0, inputValue)
            .then(value => value.content)
    }

    return (
        <React.Fragment>
            <Typography className={commonClasses.title} variant="h6">
                مسئله
            </Typography>
            <ComboBox
                options={PERSIAN_EDUCATIONS}
                value={educationMapToPersian(problemSave.education)}
                onChange={(e, newValue) =>
                    updateProblemSave({...problemSave, education: educationMapToEnglish(newValue)})
                }
                textFieldInputProps={{
                    label: "دوره تحصیلی",
                }}
            />
            <CustomTextField
                required
                label="عنوان فارسی"
                maxLength={70}
                value={problemSave.title}
                onChange={event => updateProblemSave({...problemSave, title: event.target.value})}
                helperText={isBlank(problemSave.title) ? "عنوان مسئله باید ذکر شود." : ""}
                error={isBlank(problemSave.title)}
            />
            <CustomTextField
                required
                label="عنوان انگلیسی"
                textDir="ltr"
                maxLength={70}
                value={problemSave.englishTitle}
                onChange={event => updateProblemSave({...problemSave, englishTitle: event.target.value})}
                helperText={isBlank(problemSave.englishTitle) ? "عنوان انگلیسی مسئله باید ذکر شود." : ""}
                error={isBlank(problemSave.englishTitle)}
            />
            <Autocomplete
                multiple
                options={[] as string[]}
                limitTags={3}
                id="tags"
                freeSolo
                value={problemSave.keywords}
                onChange={(event, newValue) => updateProblemSave({...problemSave, keywords: newValue})}
                renderTags={(values: string[], getTagProps) =>
                    values.map((option: string, index: number) => (
                        <Chip key={index}
                              variant="outlined"
                              label={option}
                              {...getTagProps({index})}
                        />
                    ))
                }
                renderInput={(params) => (
                    <CustomTextField
                        {...params}
                        extraInputProps={{autoComplete: 'new-password'}}
                        label="کلیدواژه"
                        helperText={isKeywordsValid(problemSave.keywords)
                            ? "" : "تعداد کلیدواژه‌ها باید بین 2 الی 5 مورد باشد. همچنین هر کلیدواژه حداقل 2 حرف می‌باشد."}
                        error={!isKeywordsValid(problemSave.keywords)}
                    />
                )}
            />
            <Typography className={commonClasses.title} variant="h6">
                استاد
            </Typography>
            <AsynchronousComboBox
                disableListWrap
                getOptionLabel={(option) => option.fullName!}
                renderOption={(option) => <Typography noWrap>{option.fullName!}</Typography>}
                extraClasses={VirtualizedListBoxStyles()}
                ListboxComponent={VirtualizedListBoxComponent}
                loadingFunction={retrieveMasters}
                textFieldInputProps={{
                    label: "استاد راهنما",
                    required: true,
                    helperText: (isNull(selectedSupervisor) ? "استاد راهنمای مربوطه باید انتخاب شود." : ""),
                    error: isNull(selectedSupervisor),
                }}
                value={selectedSupervisor}
                onChange={(e, newValue) => updateSelectedSupervisor(newValue)}
                disabled={editState === EditState.EDIT}
            />
            <CustomAlert severity="info">
                در صورت وجود تعداد زیادی نتیجه، تنها بخشی از آن نمایش داده می‌شود. برای یافتن سریع‌تر، جستجوی خود را
                دقیق‌تر نمایید.
            </CustomAlert>
        </React.Fragment>
    );
}

export default ProblemEditGeneralInfo;