import {Chip, Paper} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import {ThemeProvider} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Autocomplete from '@material-ui/lab/Autocomplete';
import React from 'react';
import {rtlTheme} from "../../../App";
import ComboBox from "../../../components/ComboBox/ComboBox";
import CustomTextField from "../../../components/Text/CustomTextField";
import ProblemService from "../../../services/api/ProblemService";
import {ProblemTabProps} from "./ProblemCreateView";

const GeneralInfo: React.FunctionComponent<ProblemTabProps> = ({commonClasses, problem, setProblem}) => {
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
                            options={ProblemService.EDUCATIONS}
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
                            required
                        />
                        <CustomTextField
                            label="عنوان انگلیسی"
                            textDirection="ltr"
                            value={problem.englishTitle}
                            onChange={event => setProblem({...problem, englishTitle: event.target.value})}
                            required
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
                                />
                            )}
                        />
                        <Typography className={commonClasses.title} variant="h5">
                            استاد
                        </Typography>
                        <CustomTextField
                            label="استاد راهنما"
                            textDirection="ltr"
                            value={problem.supervisor}
                            onChange={event => setProblem({...problem, supervisor: event.target.value})}
                            required
                        />
                    </ThemeProvider>
                </Paper>
            </Grid>
        </Grid>
    );
}

export default GeneralInfo;