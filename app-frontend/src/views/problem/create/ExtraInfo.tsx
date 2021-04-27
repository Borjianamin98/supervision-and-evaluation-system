import {Paper} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import {ThemeProvider} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React from 'react';
import {rtlTheme} from "../../../App";
import CustomTextField from "../../../components/Text/CustomTextField";
import ProblemService from "../../../services/api/ProblemService";
import {ProblemTabProps} from "./ProblemCreateView";

const ExtraInfo: React.FunctionComponent<ProblemTabProps> = (props) => {
    const {commonClasses, problem, setProblem, errorChecking} = props;

    const isDefinitionValid = (definition: string) =>
        !errorChecking || ProblemService.isDefinitionValid(definition);
    const isNotBlank = (c: string) => !errorChecking || c.length > 0;

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
                        <Typography className={commonClasses.title} variant="h5">جزییات مسئله</Typography>
                        <CustomTextField
                            label="تعریف مسئله و نیازمندی"
                            multiline={true}
                            rowsMax={4}
                            value={problem.definition}
                            onChange={event => setProblem({...problem, definition: event.target.value})}
                            helperText={isDefinitionValid(problem.definition) ?
                                "" : "تعریف مسئله در حداقل 15 کلمه توضیح داده شود."}
                            error={!isDefinitionValid(problem.definition)}
                            required
                            // extraInputProps={{
                            //     maxLength: ProblemService.MAX_LONG_STRING_LENGTH,
                            // }}
                        />
                        <CustomTextField
                            label="پیشینه مسئله"
                            multiline={true}
                            rowsMax={4}
                            value={problem.history}
                            onChange={event => setProblem({...problem, history: event.target.value})}
                            // extraInputProps={{
                            //     maxLength: ProblemService.MAX_LONG_STRING_LENGTH
                            // }}
                        />
                        <CustomTextField
                            label="ملاحظات"
                            multiline={true}
                            rowsMax={4}
                            value={problem.considerations}
                            onChange={event => setProblem({...problem, considerations: event.target.value})}
                            helperText={isNotBlank(problem.considerations) ? "" : "ملاحضات مسئله باید ذکر شود."}
                            error={!isNotBlank(problem.considerations)}
                            required
                            // extraInputProps={{
                            //     maxLength: ProblemService.MAX_LONG_STRING_LENGTH
                            // }}
                        />
                    </ThemeProvider>
                </Paper>
            </Grid>
        </Grid>
    );
}

export default ExtraInfo;