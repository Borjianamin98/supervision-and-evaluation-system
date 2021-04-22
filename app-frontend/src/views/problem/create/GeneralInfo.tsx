import {Chip, Paper} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import {ThemeProvider} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Autocomplete from '@material-ui/lab/Autocomplete';
import {useSnackbar} from "notistack";
import React from 'react';
import {rtlTheme} from "../../../App";
import ComboBox from "../../../components/ComboBox/ComboBox";
import CustomTextField from "../../../components/Text/CustomTextField";
import {getGeneralErrorMessage} from "../../../config/axios-config";
import {PERSIAN_EDUCATIONS} from "../../../model/problem";
import {User} from "../../../model/user";
import ProblemService from "../../../services/api/ProblemService";
import UserService from "../../../services/api/UserService";
import {ProblemTabProps} from "./ProblemCreateView";

const GeneralInfo: React.FunctionComponent<ProblemTabProps> = (props) => {
    const {commonClasses, problem, setProblem, errorChecking} = props;
    const {enqueueSnackbar} = useSnackbar();

    const [masterUsers, setMasterUsers] = React.useState<User[]>([]);
    React.useEffect(() => {
        UserService.retrieveMasterUsers()
            .then(value => setMasterUsers(value.data))
            .catch(error => {
                const {message, statusCode} = getGeneralErrorMessage(error);
                if (statusCode) {
                    enqueueSnackbar(`در دریافت اطلاعات از سرور خطای ${statusCode} دریافت شد. دوباره تلاش نمایید.`,
                        {variant: "error"});
                } else {
                    enqueueSnackbar(message, {variant: "error"});
                }
            });
    }, [enqueueSnackbar])

    const isKeywordsValid = (definition: string[]) =>
        !errorChecking || ProblemService.isKeywordsValid(definition);
    const isNotBlank = (c: string) => !errorChecking || c.length > 0;
    const isNotNull = <T extends {}>(c?: T) => !errorChecking || c !== undefined;

    return (
        <Grid dir="rtl" container>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <Paper square elevation={3} className={commonClasses.paper}>
                    توضیحات کلی
                </Paper>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <Paper square elevation={3} className={commonClasses.paper}>
                    <ThemeProvider theme={rtlTheme}>
                        <Typography className={commonClasses.title} variant="h5">
                            دوره تحصیلی
                        </Typography>
                        <ComboBox
                            options={PERSIAN_EDUCATIONS}
                            value={problem.education}
                            onChange={(event, value) =>
                                setProblem({...problem, education: value})}
                        />
                        <Typography className={commonClasses.title} variant="h5">
                            مسئله
                        </Typography>
                        <CustomTextField
                            label="عنوان فارسی"
                            value={problem.title}
                            onChange={event => setProblem({...problem, title: event.target.value})}
                            helperText={isNotBlank(problem.title) ? "" : "عنوان مسئله باید ذکر شود."}
                            error={!isNotBlank(problem.title)}
                            required
                            extraInputProps={{
                                maxLength: 70
                            }}
                        />
                        <CustomTextField
                            label="عنوان انگلیسی"
                            textDirection="ltr"
                            value={problem.englishTitle}
                            onChange={event => setProblem({...problem, englishTitle: event.target.value})}
                            helperText={isNotBlank(problem.englishTitle) ? "" : "عنوان انگلیسی مسئله باید ذکر شود."}
                            error={!isNotBlank(problem.englishTitle)}
                            required
                            extraInputProps={{
                                maxLength: 70
                            }}
                        />
                        <Autocomplete
                            multiple
                            options={[]}
                            limitTags={3}
                            id="tags"
                            freeSolo
                            value={problem.keywords}
                            onChange={(event, value: string[]) => {
                                setProblem({...problem, keywords: value});
                            }}
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
                                    helperText={isKeywordsValid(problem.keywords)
                                        ? "" : "تعداد کلیدواژه‌ها باید بین 2 الی 5 مورد باشد. همچنین هر کلیدواژه حداقل 2 حرف می‌باشد."}
                                    error={!isKeywordsValid(problem.keywords)}
                                />
                            )}
                        />
                        <Typography className={commonClasses.title} variant="h5">
                            استاد
                        </Typography>
                        <ComboBox
                            options={masterUsers}
                            getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                            value={problem.supervisor}
                            onChange={(event, newValue) => setProblem({...problem, supervisor: newValue})}
                            inputProps={{
                                label: "استاد راهنما",
                                required: true,
                                helperText: (isNotNull(problem.supervisor) ? "" : "استاد راهنمای مربوط به مسئله باید انتخاب شود."),
                                error: !isNotNull(problem.supervisor)
                            }}
                        />
                    </ThemeProvider>
                </Paper>
            </Grid>
        </Grid>
    );
}

export default GeneralInfo;