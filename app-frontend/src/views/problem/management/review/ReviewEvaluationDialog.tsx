import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Stepper from "@material-ui/core/Stepper";
import {ThemeProvider} from "@material-ui/core/styles";
import Rating from "@material-ui/lab/Rating";
import React from 'react';
import {rtlTheme} from "../../../../App";
import CustomAlert from "../../../../components/Alert/CustomAlert";
import MultiActionDialog from "../../../../components/Dialog/MultiActionDialog";
import CenterBox from "../../../../components/Grid/CenterBox";
import CustomTextField from "../../../../components/Text/CustomTextField";
import CustomTypography from "../../../../components/Typography/CustomTypography";
import {Problem} from "../../../../model/problem/problem";
import {User, userRoleInfo} from "../../../../model/user/User";
import AuthenticationService from "../../../../services/api/AuthenticationService";

interface ReviewEvaluationDialogProps {
    problem: Problem,
    open: boolean,
    onClose: () => void,
}

const ReviewEvaluationDialog: React.FunctionComponent<ReviewEvaluationDialogProps> = (props) => {
    const {problem, open, onClose} = props;
    const [activeStep, setActiveStep] = React.useState(0);

    const jwtPayload = AuthenticationService.getJwtPayload()!;
    const steps = ["پایان‌نامه (پروژه)", "ارزیابی همکار"];

    const stepperContent = () => {
        if (activeStep === 0) {
            return <>
                <CustomTypography lineHeight={2} boxProps={{marginBottom: 1}}>
                    جلسه دفاع پایان‌نامه (پروژه) در تاریخ مقرر تشکیل شده است.
                    با توجه به جلسه‌ی برگزار شده، ارزیابی خود را بر مبنای کیفیت ارائه‌ی دانشجو، موضوع پایا‌ن‌نامه
                    (پروژه)، میزان پیشرفت دانشجو و ... مورد بررسی قرار داده و در نهایت نمره‌ی نهایی دانشجو را وارد
                    نمایید.
                </CustomTypography>
                <CustomAlert severity="info">
                    <CustomTypography lineHeight={2}>
                        هیچ‌کدام از افراد دیگر در پایان‌نامه (پروژه) ارزیابی شما را مشاهده نمی‌کنند و این اطلاعات به
                        صورت خودکار در انتهای فرآیند برای محاسبه‌ی نمره‌ی نهایی دانشجو استفاده می‌شود.
                    </CustomTypography>
                </CustomAlert>
                <CustomTextField
                    autoFocus
                    label={"نمره نهایی"}
                    // value={content}
                    // onChange={(e) => setContent(e.target.value)}
                    // helperText={isBlank(content) ? "اطلاعات مربوطه نمی‌تواند خالی باشد." : ""}
                    // error={isBlank(content)}
                />
            </>;
        } else if (activeStep === 1) {
            return <>
                <CustomTypography lineHeight={2} boxProps={{marginBottom: 1}}>
                    نحوه‌ی عملکرد اساتید دیگر در پیش‌برد پایان‌نامه (پروژه) و جلسه‌ی دفاع، از جمله اطلاعات مفیدی است
                    که می‌تواند در انتخاب اساتید در دوره‌های بعدی، شناخت اساتید مدعو و ... مفید باشد.
                    ممنون می‌شویم که بخشی از زمان پرارزشتان را برای پرکردن اطلاعات زیر در مورد دیگر اساتید صرف کنید
                    به امید این که بازخوردهای شما بتواند در بهبود پایان‌نامه (پروژه‌) و جلسات آینده مفید واقع شود.
                </CustomTypography>
                <List>
                    {[...problem.referees, problem.supervisor]
                        .filter(user => user.id !== jwtPayload.userId)
                        .map(referee => (
                            <div key={referee.id}>
                                <PersonListItem user={referee}/>
                                <Divider component={"li"}/>
                            </div>
                        ))}
                </List>
            </>
        } else {
            return null;
        }
    }

    return (
        <ThemeProvider theme={rtlTheme}>
            <MultiActionDialog
                open={open}
                onClose={reason => {
                    if (reason === "closed") {
                        onClose();
                    } else if (reason === "next") {
                        setActiveStep(prev => prev + 1);
                    } else if (reason === "previous") {
                        setActiveStep(prev => prev - 1);
                    } else if (reason === "confirm") {
                        // setActiveStep(prev => prev - 1);
                    }
                }}
                title={"ارزیابی پایان‌نامه (پروژه)"}
                description={""}
                actions={[
                    {content: "قسمت قبل", name: "previous", disabled: false},
                    {content: "قسمت بعد", name: "next", disabled: false},
                    {content: "تایید", name: "confirm", disabled: false},
                ]}
            >
                <Stepper alternativeLabel activeStep={activeStep}>
                    {steps.map((step) => (
                        <Step key={step}>
                            <StepLabel>{step}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                {stepperContent()}
            </MultiActionDialog>
        </ThemeProvider>
    );
}

const PersonListItem: React.FunctionComponent<{ user: User }> = (props) => {
    const {user} = props;
    return (
        <ListItem>
            <ListItemText
                disableTypography={true}
            >
                <CustomTypography>{user.fullName}</CustomTypography>
                <CustomTypography>{userRoleInfo(user)}</CustomTypography>
                <CustomTextField
                    label="نظرات"
                    maxLength={255}
                    multiline={true}
                    rows={3}
                    // value={problemSave.definition}
                    // onChange={event => updateProblemSave({...problemSave, definition: event.target.value})}
                    // helperText={isDefinitionValid(problemSave.definition) ? "" : "تعریف مسئله در حداقل 15 کلمه توضیح داده شود."}
                    // error={!isDefinitionValid(problemSave.definition)}
                />
                <CenterBox flexDirection={"row"} justifyContent={"space-between"}>
                    <CustomTypography>امتیازدهی:</CustomTypography>
                    <Rating
                        name={`rating-${user.id}`}
                        size="large"
                        // value={value}
                        // onChange={(event, newValue) => {
                        //     setValue(newValue);
                        // }}
                    />
                </CenterBox>
            </ListItemText>
        </ListItem>
    )
}

export default ReviewEvaluationDialog;