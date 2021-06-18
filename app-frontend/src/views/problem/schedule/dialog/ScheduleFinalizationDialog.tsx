import Box from '@material-ui/core/Box';
import {ThemeProvider} from "@material-ui/core/styles";
import React from 'react';
import {rtlTheme} from '../../../../App';
import MultiActionDialog from "../../../../components/Dialog/MultiActionDialog";
import CustomTypography from "../../../../components/Typography/CustomTypography";
import {Problem} from "../../../../model/problem/problem";

interface ScheduleDateDialogProps {
    problem: Problem,
    open: boolean,
    onClose: () => void,
}

const ScheduleFinalizationDialog: React.FunctionComponent<ScheduleDateDialogProps> = (props) => {
    const {problem, open, onClose} = props;

    return (
        <ThemeProvider theme={rtlTheme}>
            <MultiActionDialog
                title={"تایین زمان دفاع"}
                description={`زمان دفاع پایان‌نامه (پروژه) «${problem.title}»`}
                open={open}
                onClose={reason => {
                    if (reason === "closed") {
                        onClose();
                        return;
                    }
                    // Do something
                }}
                actions={[
                    {content: "انصراف", name: "closed"},
                    {content: "زمان‌بندی دوباره", name: "reschedule"},
                    {content: "تایید زمان دفاع", name: "confirm"},
                ]}
            >
                <Box display={"flex"} flexDirection={"column"}>
                    <CustomTypography lineHeight={2}>
                        زمان‌بندی دفاع مربوط به پایان‌نامه (پروژه) شروع شده است و افراد ذینفع مختلف زمان‌هایی را
                        مشخص نموده‌اند.
                        با تغییر این زمان، زمان‌بندی‌هایی که در خارج از بازه‌ی انتخابی قرار می‌گیرند در نظر
                        گرفته نخواهند شد.
                        پیش از تغییر زمان مربوطه، از هماهنگی‌های لازم با تمامی افراد ذینفع اطمینان حاصل کنید.
                        با تغییر این زمان‌بندی، اطلاعیه‌ای برای تمامی افراد ذینفع ارسال می‌شود تا نسبت به موضوع
                        اطلاع پیدا کنند.
                    </CustomTypography>
                </Box>
            </MultiActionDialog>
        </ThemeProvider>
    )
}

export default ScheduleFinalizationDialog;
