import {Box, IconButton} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import {ThemeProvider, useTheme} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import {EmitType} from '@syncfusion/ej2-base'
import {
    Day,
    DragAndDrop,
    Inject,
    PopupOpenEventArgs,
    Resize,
    ResourceDirective,
    ResourcesDirective,
    ScheduleComponent,
    TimelineViews,
    ViewDirective,
    ViewsDirective
} from '@syncfusion/ej2-react-schedule'
import moment from "jalali-moment";
import React from 'react';
import {rtlTheme} from "../App";
import CenterGrid from "../components/Grid/CenterGrid";
import "./scheduler.css"

const SettingsView: React.FunctionComponent = () => {
    const scheduleComponentRef = React.useRef<ScheduleComponent>(null);

    const data = [{
        id: 1,
        subject: 'Meeting',
        startTime: new Date(2021, 4, 18, 10, 0),
        endTime: new Date(2021, 4, 18, 12, 30),
        isAllDay: false,
        Status: 'Completed',
        Priority: 'High',
        // isReadonly: true,
    }];

    const ownerData = [
        {OwnerText: 'Nancy', Id: 1, OwnerColor: '#ffaa00'},
        {OwnerText: 'Steven', Id: 2, OwnerColor: '#f8a398'},
        {OwnerText: 'Michael', Id: 3, OwnerColor: '#7499e1'}
    ];

    const onPopupOpen: EmitType<PopupOpenEventArgs> = (args) => {
        if (args) {
            args.cancel = true;
        }
    }

    const dateHeaderTemplate = (props: { date: Date }) => {
        const dateMoment = moment(props.date).locale('fa');
        return (
            <CenterGrid>
                <div className="e-header-date">{dateMoment.format('D')}</div>
                <div className="e-header-day">{dateMoment.format('ddd')}</div>
            </CenterGrid>
        );
    }

    const majorSlotTemplate = (props: { date: Date }) => {
        return (
            <div>{moment(props.date).locale('fa').format("hh:mm a")}</div>
        );
    }
    if (scheduleComponentRef.current) {
        // Unfortunately, 'timescale' field doesn't support function as template and
        // because of typescript, we should use approach like this to override it.
        (scheduleComponentRef.current.timeScale as any).majorSlotTemplate = majorSlotTemplate;
    }

    const addDaysToDate = (date: Date, days: number) => {
        return new Date(date.setDate(date.getDate() + days));
    }
    const changeIntervalOnClick = (days: number) => {
        if (scheduleComponentRef.current) {
            const currentStartDate = scheduleComponentRef.current.getCurrentViewDates()[0];
            scheduleComponentRef.current.changeDate(addDaysToDate(currentStartDate, days));
        }
    }

    const headerBarDate = () => {
        const currentStartDateMoment = moment(new Date()).locale("fa");
        const currentEndDateMoment = moment(new Date()).locale("fa");
        if (currentStartDateMoment.month() === currentEndDateMoment.month()) {
            return `${currentStartDateMoment.day()} تا ${currentEndDateMoment.day()} ${currentStartDateMoment.format("MMMM")} ${currentStartDateMoment.year()}`
        } else {
            return `${currentStartDateMoment.day()} تا ${currentEndDateMoment.day()} ${currentStartDateMoment.format("MMMM")} ${currentStartDateMoment.year()}`
        }
    }

    const theme = useTheme();
    const isRtlTheme = theme.direction === 'rtl';

    return (
        <ThemeProvider theme={rtlTheme}>
            <Button variant="contained" color="primary" onClick={() => changeIntervalOnClick(+7)}>
                هفته بعد
            </Button>
            <Button variant="contained" color="primary" onClick={() => changeIntervalOnClick(-7)}>
                هفته قبل
            </Button>
            <Box paddingY={1} className="e-schedule e-schedule-toolbar">
                <Grid
                    container alignItems="center" justify="space-between"
                    dir="rtl"
                >
                    <Grid item>
                        <IconButton
                            color="primary"
                            // onClick={() => isRtlTheme ? handleBackButtonClick() : handleNextButtonClick()}
                            // disabled={isRtlTheme ? page === 0 : page === maxPageNumber}
                        >
                            {isRtlTheme ? <KeyboardArrowLeft/> : <KeyboardArrowRight/>}
                        </IconButton>
                    </Grid>
                    <Grid item>
                        <Typography variant="h6">
                            {headerBarDate()}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <IconButton
                            color="primary"
                            // onClick={() => isRtlTheme ? handleNextButtonClick() : handleBackButtonClick()}
                            // disabled={isRtlTheme ? page === maxPageNumber : page === 0}
                        >
                            {isRtlTheme ? <KeyboardArrowRight/> : <KeyboardArrowLeft/>}
                        </IconButton>
                    </Grid>
                </Grid>
            </Box>
            <ScheduleComponent
                // allowDragAndDrop={true}
                // allowResizing={true}
                ref={scheduleComponentRef}
                width="100%"
                showHeaderBar={false}
                allowInline={false}
                showQuickInfo={false}
                showTimeIndicator={false}
                dateHeaderTemplate={dateHeaderTemplate}
                // popupOpen={onPopupOpen}
                height="550px"
                enableRtl={true}
                selectedDate={new Date()}
                eventSettings={{
                    dataSource: data,
                    fields: {
                        id: 'id',
                        subject: {name: 'subject'},
                        isAllDay: {name: 'isAllDay'},
                        startTime: {name: 'startTime'},
                        endTime: {name: 'endTime'},
                        isReadonly: 'isReadonly'
                    }
                }}
            >
                <ViewsDirective>
                    <ViewDirective
                        option="Day"
                        interval={7}
                        workDays={[0, 1, 2, 3, 6]}
                        startHour="07:00"
                        endHour="20:00"
                        displayName="روزانه"
                    />
                </ViewsDirective>
                <ResourcesDirective>
                    <ResourceDirective
                        field='OwnerId'
                        title='Owner'
                        name='Owners'
                        dataSource={ownerData}
                        textField='OwnerText'
                        idField='Id'
                        colorField='OwnerColor'
                    >
                    </ResourceDirective>
                </ResourcesDirective>
                <Inject services={[Day, TimelineViews, DragAndDrop, Resize]}/>
            </ScheduleComponent>;
        </ThemeProvider>
    )
}

export default SettingsView;