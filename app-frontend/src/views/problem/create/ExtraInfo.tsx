import {Paper} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import {ThemeProvider} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React from 'react';
import {rtlTheme} from "../../../App";
import CustomTextField from "../../../components/Text/CustomTextField";
import {ProblemTabProps} from "./ProblemCreateView";

const ExtraInfo: React.FunctionComponent<ProblemTabProps> = ({commonClasses, problem, setProblem}) => {
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
                            rows={2}
                            value={problem.definition}
                            onChange={event => setProblem({...problem, definition: event.target.value})}
                            required
                        />
                        <CustomTextField
                            label="پیشینه مسئله"
                            multiline={true}
                            rows={2}
                            value={problem.history}
                            onChange={event => setProblem({...problem, history: event.target.value})}
                        />
                        <CustomTextField
                            label="ملاحظات"
                            multiline={true}
                            rows={2}
                            value={problem.considerations}
                            onChange={event => setProblem({...problem, considerations: event.target.value})}
                        />
                    </ThemeProvider>
                </Paper>
            </Grid>
        </Grid>
    );
}

export default ExtraInfo;