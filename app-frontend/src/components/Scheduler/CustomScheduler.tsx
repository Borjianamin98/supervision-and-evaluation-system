import {ThemeProvider} from '@material-ui/core';
import Typography from "@material-ui/core/Typography";
import {ItemModel} from '@syncfusion/ej2-navigations/src/toolbar/toolbar-model'
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
import ReactDOM from 'react-dom';
import {rtlTheme} from "../../App";
import {DateRange} from '../../model/schedule/event/DateRange';
import {SyncfusionSchedulerEvent} from "../../model/schedule/event/ScheduleEvent";
import CenterBox from "../Grid/CenterBox";
import AppointmentEventTemplate from "./AppointmentEventTemplate";
import ParticipantsColorInfo from "./ParticipantsColorInfo";
import "./scheduler.css"

function convertDateRangeToText(startDate: Date, rangeDays: number) {
    const startDateMoment = moment(startDate).locale("fa");
    const endDateMoment = moment(startDate).add(rangeDays - 1, "days").locale("fa");

    const startDateMonth = startDateMoment.format("MMMM");
    const endDateMonth = endDateMoment.format("MMMM");
    const startDateYear = startDateMoment.format("YYYY");
    const endDateYear = endDateMoment.format("YYYY");
    let headerDate: string;
    if (startDateYear !== endDateYear) {
        headerDate = startDateMoment.format("D MMMM YYYY تا ")
            + endDateMoment.format("D MMMM YYYY")
    } else if (startDateMonth !== endDateMonth) {
        headerDate = startDateMoment.format("D MMMM تا ")
            + endDateMoment.format("D MMMM YYYY")
    } else {
        headerDate = startDateMoment.format("D تا ")
            + endDateMoment.format("D MMMM YYYY")
    }
    return headerDate;
}

export interface Participant {
    id: number,
    name: string,
    color: string,
}

interface CustomSchedulerProps extends Omit<ScheduleModel, "cellClick"> {
    totalDaysInView: number,
    onStartDateChange: (startDate: Date) => void,

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
        onStartDateChange,
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
    const onPopupOpen = (args?: PopupOpenEventArgs) => {
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
     * Disable touch mode (scroll to left/right to navigate) of scheduler view.
     * Also change the date range text on initial loading.
     */
    const onDataBound = () => {
        // Based on issue: https://www.syncfusion.com/support/directtrac/incidents/329117
        if (scheduleComponentRef.current?.scheduleTouchModule) {
            // @ts-ignore
            scheduleComponentRef.current.scheduleTouchModule.touchObj.destroy();
            // @ts-ignore
            scheduleComponentRef.current.scheduleTouchModule.touchObj = null;
        }
        // Update the date range text in initial lode
        // More info: https://www.syncfusion.com/kb/10948/how-to-customize-the-scheduler-toolbar
        updateDateRangeText(totalDaysInView);
    }

    /**
     * Override cell click handler to allow custom handler beside disabling
     * all day events in scheduler.
     */
    const cellClickHandler = (args?: CellClickEventArgs) => {
        if (args) {
            if (args.isAllDay) {
                args.cancel = true; // Disable all day events
            } else {
                if (scheduleComponentRef.current) {
                    /**
                     * Do not allow creating events beyond maximum date and before minimum date.
                     */
                    if (args.startTime < new Date(minimumDate) || args.startTime > new Date(maximumDate)) {
                        args.cancel = true;
                        return;
                    }
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
                    } else {
                        args.cancel = true;
                    }
                }
            }
        }
    }

    /**
     * Disable double click on cell (open event editor by default)
     */
    const cellDoubleClickHandler = (args?: CellClickEventArgs) => {
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
    const onActionBegin = (actionEventArgs?: ActionEventArgs) => {
        if (actionEventArgs) {
            if (actionEventArgs.requestType === "eventChange") {
                const changedEvent = actionEventArgs.changedRecords
                    && actionEventArgs.changedRecords[0] as SyncfusionSchedulerEvent;
                if (changedEvent && scheduleComponentRef.current) {
                    onEventChange(scheduleComponentRef.current, changedEvent);
                } else {
                    actionEventArgs.cancel = true;
                }
            } else if (actionEventArgs.requestType === 'toolbarItemRendering') {
                const items = actionEventArgs.items as ItemModel[];
                const prevItem = items[0];
                const nextItem = items[1];
                nextItem.align = "Right";
                const dateRangeText: ItemModel = {
                    align: "Center",
                    template: "",
                    type: "Input",
                    cssClass: 'e-custom-date-range'
                };
                actionEventArgs.items = [prevItem, dateRangeText, nextItem]
            }
        }
    }

    /**
     * Use action complete event to change the date range text on navigations.
     * @param args
     */
    const onActionComplete = (args: ActionEventArgs) => {
        if (args.requestType === 'dateNavigate') {
            const startDate = updateDateRangeText(totalDaysInView);
            if (startDate) {
                onStartDateChange(startDate);
            }
        }
    }

    /**
     * Function used to update header date.
     */
    const updateDateRangeText = (totalDaysInView: number): Date | void => {
        if (scheduleComponentRef.current) {
            const currentViewDates = scheduleComponentRef.current.getCurrentViewDates();
            const customDateElement =
                scheduleComponentRef.current.element.querySelector<HTMLElement>('.e-toolbar-item.e-custom-date-range');
            if (customDateElement) {
                const headerDate = convertDateRangeToText(currentViewDates[0], totalDaysInView);
                ReactDOM.render(
                    <Typography style={{fontFamily: "Vazir"}}>{headerDate}</Typography>,
                    customDateElement
                );
            }
            return currentViewDates[0];
        }
    }

    /**
     * Use react hook to update date header when interval of view changed.
     */
    React.useEffect(() => {
        updateDateRangeText(totalDaysInView);
    }, [totalDaysInView]);

    /**
     * Custom delete event handler used in event template
     */
    const deleteEventHandler = (syncfusionEvent: SyncfusionSchedulerEvent) => {
        if (scheduleComponentRef.current) {
            onEventDelete(scheduleComponentRef.current, syncfusionEvent);
        }
    }

    return <ThemeProvider theme={rtlTheme}>
        <ParticipantsColorInfo participants={participants}/>
        <ScheduleComponent
            ref={scheduleComponentRef}
            width="100%"
            cssClass="custom-scheduler-style"
            allowDragAndDrop={true}
            allowResizing={true}
            allowInline={false}
            showQuickInfo={false}
            showTimeIndicator={false}
            allowMultiCellSelection={false}
            allowMultiDrag={false}
            allowMultiRowSelection={false}
            enableRtl={true}
            actionBegin={onActionBegin}
            actionComplete={onActionComplete}
            cellClick={cellClickHandler}
            cellDoubleClick={cellDoubleClickHandler}
            dateHeaderTemplate={dateHeaderTemplate}
            dataBound={onDataBound}
            popupOpen={onPopupOpen}
            resizeStop={onResizeStop}
            minDate={minimumDate}
            maxDate={maximumDate}
            startHour={`${scheduleStartHour.toString().padStart(2, '0')}:00`}
            endHour={`${scheduleEndHour.toString().padStart(2, '0')}:00`}
            workHours={{
                highlight: true, start: '10:00', end: '18:00'
            }}
            eventSettings={{
                dataSource: scheduleEvents,
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