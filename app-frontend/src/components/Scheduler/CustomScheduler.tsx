import {ThemeProvider} from '@material-ui/core';
import {EmitType} from '@syncfusion/ej2-base'
import {
    ActionEventArgs,
    CellClickEventArgs,
    Day,
    DragAndDrop,
    Inject,
    PopupOpenEventArgs,
    Resize,
    ResizeEventArgs,
    ResourceDirective,
    ResourcesDirective,
    ScheduleComponent,
    ScheduleModel,
    TimelineViews,
    ViewDirective,
    ViewsDirective
} from '@syncfusion/ej2-react-schedule'
import moment from "jalali-moment";
import React from 'react';
import {rtlTheme} from "../../App";
import {DateRange} from '../../model/schedule/DateRange';
import {SyncfusionSchedulerEvent} from "../../model/schedule/ScheduleEvent";
import DateUtils from "../../utility/DateUtils";
import CenterBox from "../Grid/CenterBox";
import AppointmentEventTemplate from "./AppointmentEventTemplate";
import ParticipantsColorInfo from "./ParticipantsColorInfo";
import ScheduleHeaderBar from "./ScheduleHeaderBar";
import "./scheduler.css"

export interface Participant {
    id: number,
    name: string,
    color: string,
}

interface CustomSchedulerProps extends Omit<ScheduleModel, "cellClick"> {
    totalDaysInView: number,
    onDateChange: (startDate: Date) => void,

    minimumDate: Date,
    maximumDate: Date,
    timeScaleInterval: number,
    minimumDurationMinutes: number,

    scheduleEvents?: SyncfusionSchedulerEvent[],
    participants: Participant[],

    onCellClick: (scheduler: ScheduleComponent, cellInfo: DateRange) => void,
    onEventChange: (scheduler: ScheduleComponent, editedEvent: SyncfusionSchedulerEvent) => void,
    onEventDelete: (scheduler: ScheduleComponent, deletedEvent: SyncfusionSchedulerEvent) => void,
}

const CustomScheduler: React.FunctionComponent<CustomSchedulerProps> = (props) => {
    const scheduleComponentRef = React.useRef<ScheduleComponent>(null);

    const {
        totalDaysInView,
        onDateChange,
        minimumDate,
        maximumDate,
        timeScaleInterval,
        minimumDurationMinutes,
        scheduleEvents,
        participants,
        onCellClick,
        onEventChange,
        onEventDelete,
        ...rest
    } = props;

    const scheduleStartHour = 8;
    const scheduleEndHour = 20;

    React.useEffect(() => {
        if (scheduleComponentRef.current) {
            scheduleComponentRef.current.eventSettings.dataSource = scheduleEvents;
        }
    }, [scheduleEvents])

    React.useEffect(() => {
        /**
         * Custom persian major slot info per row in scheduler
         */
        const majorSlotTemplate = (props: { date: Date }) => {
            return <div>{moment(props.date).locale('fa').format("hh:mm a")}</div>;
        }

        // useEffect(callback, []) hook invokes the callback right after mounting when the input element
        // has been created in DOM. It is guaranteed that the DOM is constructed.
        if (scheduleComponentRef.current) {
            // Unfortunately, 'timescale' field doesn't support function as template and
            // because of typescript, we should use approach like this to override it.
            (scheduleComponentRef.current.timeScale as any).majorSlotTemplate = majorSlotTemplate;
        }
    }, []);

    /**
     * Disable popup of scheduler completely
     */
    const onPopupOpen: EmitType<PopupOpenEventArgs> = (args) => {
        if (args) {
            args.cancel = true;
        }
    }

    /**
     * Header template of each day column in scheduler
     */
    const dateHeaderTemplate = (props: { date: Date }) => {
        const dateMoment = moment(props.date).locale('fa');
        return <CenterBox>
            <div className="e-header-date">{dateMoment.format('D')}</div>
            <div className="e-header-day">{dateMoment.format('ddd')}</div>
        </CenterBox>;
    }

    /**
     * Disable touch mode (scroll to left/right to navigate) of scheduler view
     */
    const onDataBound = () => {
        // Based on issue: https://www.syncfusion.com/support/directtrac/incidents/329117
        if (scheduleComponentRef.current?.scheduleTouchModule) {
            // @ts-ignore
            scheduleComponentRef.current.scheduleTouchModule.touchObj.destroy();
            // @ts-ignore
            scheduleComponentRef.current.scheduleTouchModule.touchObj = null;
        }
    }

    /**
     * Override cell click handler to allow custom handler beside disabling
     * all day events in scheduler.
     */
    const cellClickHandler: EmitType<CellClickEventArgs> = (args) => {
        if (args) {
            if (args.isAllDay) {
                args.cancel = true; // Disable all day events
            } else {
                if (scheduleComponentRef.current) {
                    /**
                     * Do not allow less than minimum duration for each event by check end time
                     * of created event. Also pass correct minimum end time as parameter to user
                     * of component.
                     */
                    const legalEndTime = moment(args.startTime).add(minimumDurationMinutes, "minutes");
                    const legalEndTimeMinutesOfDay = legalEndTime.second()
                        + 60 * legalEndTime.minutes()
                        + 3600 * legalEndTime.hours();
                    if (legalEndTimeMinutesOfDay <= scheduleEndHour * 3600) {
                        onCellClick(scheduleComponentRef.current, {
                            startDate: args.startTime,
                            endDate: legalEndTime.toDate(),
                        });
                    }
                }
            }
        }
    }

    /**
     * Disable double click on cell (open event editor by default)
     */
    const cellDoubleClickHandler: EmitType<CellClickEventArgs> = (args) => {
        if (args) {
            args.cancel = true;
        }
    }

    /**
     * Add feature to force minimum duration for each event.
     */
    const onResizeStop = (resizeEventArgs?: ResizeEventArgs) => {
        if (resizeEventArgs) {
            const event = resizeEventArgs.data as SyncfusionSchedulerEvent;
            const startDate = event.startDate;
            const endDate = event.endDate;
            if (endDate && startDate) {
                const durationMinutes = moment.duration(moment(endDate).diff(startDate)).asMinutes();
                if (durationMinutes < minimumDurationMinutes) {
                    resizeEventArgs.cancel = true;
                }
            }
        }
    }

    /**
     * Override action begin handler to provide specific handler for different type of
     * events in scheduler.
     */
    const onActionBegin: EmitType<ActionEventArgs> = (actionEventArgs) => {
        if (actionEventArgs) {
            if (actionEventArgs.requestType === "eventChange") {
                const changedEvent = actionEventArgs.changedRecords
                    && actionEventArgs.changedRecords[0] as SyncfusionSchedulerEvent;
                if (changedEvent && scheduleComponentRef.current) {
                    onEventChange(scheduleComponentRef.current, changedEvent);
                } else {
                    actionEventArgs.cancel = true;
                }
            }
        }
    }

    /**
     * Custom delete event handler used in event template
     */
    const deleteEventHandler = (syncfusionEvent: SyncfusionSchedulerEvent) => {
        if (scheduleComponentRef.current) {
            onEventDelete(scheduleComponentRef.current, syncfusionEvent);
        }
    }

    return <ThemeProvider theme={rtlTheme}>
        <ScheduleHeaderBar
            totalDaysInView={totalDaysInView}
            minimumDate={minimumDate}
            maximumDate={maximumDate}
            onDateChange={startDate => {
                scheduleComponentRef.current?.changeDate(startDate);
                onDateChange(startDate);
            }}
        />
        <ParticipantsColorInfo participants={participants}/>
        <ScheduleComponent
            ref={scheduleComponentRef}
            actionBegin={onActionBegin}
            width="100%"
            cssClass="schedule-cell-dimension"
            allowDragAndDrop={true}
            allowResizing={true}
            showHeaderBar={false}
            allowInline={false}
            showQuickInfo={false}
            showTimeIndicator={false}
            allowMultiCellSelection={false}
            allowMultiDrag={false}
            allowMultiRowSelection={false}
            cellClick={cellClickHandler}
            cellDoubleClick={cellDoubleClickHandler}
            dateHeaderTemplate={dateHeaderTemplate}
            dataBound={onDataBound}
            popupOpen={onPopupOpen}
            resizeStop={onResizeStop}
            enableRtl={true}
            // selectedDate={DateUtils.getCurrentDate()}
            minDate={minimumDate}
            maxDate={maximumDate}
            startHour={`${scheduleStartHour.toString().padStart(2, '0')}:00`}
            endHour={`${scheduleEndHour.toString().padStart(2, '0')}:00`}
            workHours={{
                highlight: true, start: '10:00', end: '18:00'
            }}
            eventSettings={{
                fields: {
                    id: 'id',
                    subject: {name: 'subject'},
                    isAllDay: {name: 'isAllDay'},
                    startTime: {name: 'startDate'},
                    endTime: {name: 'endDate'},
                    isReadonly: 'readonly'
                }
            }}
            timeScale={{
                enable: true,
                interval: timeScaleInterval * 2,
                slotCount: 2
            }}
            {...rest}
        >
            <ViewsDirective>
                <ViewDirective
                    option="Day"
                    interval={totalDaysInView}
                    workDays={[0, 1, 2, 3, 6]}
                    displayName="روزانه"
                    eventTemplate={(syncfusionEvent: SyncfusionSchedulerEvent) => AppointmentEventTemplate({
                        syncfusionEvent: syncfusionEvent,
                        onDelete: deleteEventHandler,
                    })}
                />
            </ViewsDirective>
            <ResourcesDirective>
                <ResourceDirective
                    dataSource={participants}
                    textField='name'
                    idField='id'
                    colorField='color'
                    field='ownerId'
                    title='فرد'
                    name='افراد'
                >
                </ResourceDirective>
            </ResourcesDirective>
            <Inject services={[Day, TimelineViews, DragAndDrop, Resize]}/>
        </ScheduleComponent>
    </ThemeProvider>
}

export default CustomScheduler;