import {Box, IconButton} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import {ThemeProvider, useTheme} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import {EmitType} from '@syncfusion/ej2-base'
import {
    ActionEventArgs,
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

    const [selectedDate, setSelectedDate] = React.useState(new Date());
    const onActionComplete: EmitType<ActionEventArgs> = (args) => {
        if (scheduleComponentRef.current && args) {
            if (args.requestType === "viewNavigate" || args.requestType === "dateNavigate") {
                const currentViewDates = scheduleComponentRef.current.getCurrentViewDates();
                setSelectedDate(currentViewDates[0]);
            }
        }
    }

    const hasBeyondMaxRange = () => {
        if (scheduleComponentRef.current) {
            const targetDate = moment(selectedDate).add(+7, "days").toDate();
            return targetDate > scheduleComponentRef.current.maxDate;
        } else {
            return false;
        }
    }
    const hasBeforeMinRange = () => {
        if (scheduleComponentRef.current) {
            const targetDate = moment(selectedDate).add(-1, "days").toDate();
            return targetDate < scheduleComponentRef.current.minDate;
        } else {
            return false;
        }
    }
    const changeIntervalOnClick = (days: number) => {
        if (scheduleComponentRef.current) {
            const currentStartDate = scheduleComponentRef.current.getCurrentViewDates()[0];
            scheduleComponentRef.current.changeDate(moment(currentStartDate).add(days, "days").toDate());
        }
    }
    const headerBarDate = () => {
        const currentStartDateMoment = moment(selectedDate).locale("fa");
        const currentEndDateMoment = moment(selectedDate).add(6, "days").locale("fa");
        const currentStartDateMonth = currentStartDateMoment.format("MMMM");
        const currentEndDateMonth = currentEndDateMoment.format("MMMM");
        if (currentStartDateMonth === currentEndDateMonth) {
            return currentStartDateMoment.format("D")
                + " تا "
                + currentEndDateMoment.format("D")
                + " "
                + currentStartDateMonth
                + " "
                + currentStartDateMoment.format("YYYY");
        } else {
            return currentStartDateMoment.format("D")
                + " "
                + currentStartDateMonth
                + " تا "
                + currentEndDateMoment.format("D")
                + " "
                + currentEndDateMonth
                + " "
                + currentStartDateMoment.format("YYYY");
        }
    }

    const theme = useTheme();
    const isRtlTheme = theme.direction === 'rtl';

    return (
        <ThemeProvider theme={rtlTheme}>
            <Box paddingY={1} className="e-schedule e-schedule-toolbar">
                <Grid
                    container alignItems="center" justify="space-between"
                    dir="rtl"
                >
                    <Grid item>
                        <IconButton
                            color="primary"
                            onClick={() => isRtlTheme ? changeIntervalOnClick(+7) : changeIntervalOnClick(-7)}
                            disabled={isRtlTheme ? hasBeyondMaxRange() : hasBeforeMinRange()}
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
                            onClick={() => isRtlTheme ? changeIntervalOnClick(-7) : changeIntervalOnClick(+7)}
                            disabled={isRtlTheme ? hasBeforeMinRange() : hasBeyondMaxRange()}
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
                actionComplete={onActionComplete}
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