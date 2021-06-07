import {EmitType} from '@syncfusion/ej2-base'
import {
    ActionEventArgs,
    CellClickEventArgs,
    Day,
    DragAndDrop,
    Inject,
    PopupOpenEventArgs,
    Resize,
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
import {DateRange} from '../../model/schedule/DateRange';
import {SyncfusionSchedulerEvent} from "../../model/schedule/ScheduleEvent";
import CenterBox from "../Grid/CenterBox";
import AppointmentEventTemplate from "./AppointmentEventTemplate";
import ScheduleHeaderBar from "./ScheduleHeaderBar";
import "./scheduler.css"

interface Participant {
    id: number,
    name: string,
    color: string,
}

interface CustomSchedulerProps extends Omit<ScheduleModel, "cellClick"> {
    totalDaysInView: number,
    selectedDate: Date,
    onDateChange: (startDate: Date) => void,

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
        selectedDate,
        onDateChange,
        scheduleEvents,
        participants,
        onCellClick,
        onEventChange,
        onEventDelete,
        ...rest
    } = props;

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
                    onCellClick(scheduleComponentRef.current, {
                        startDate: args.startTime,
                        endDate: args.endTime,
                    });
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

    const minimumDate = new Date(new Date().getFullYear() - 1, 0, 1);
    const maximumDate = new Date(new Date().getFullYear() + 2, 0, 1);

    return <>
        <ScheduleHeaderBar
            totalDaysInView={totalDaysInView}
            startDate={selectedDate}
            minimumDate={minimumDate}
            maximumDate={maximumDate}
            onDateChange={startDate => {
                // scheduleComponentRef.current?.changeDate(startDate);
                onDateChange(startDate);
            }}
        />
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
            height="550px"
            enableRtl={true}
            selectedDate={selectedDate}
            minDate={minimumDate}
            maxDate={maximumDate}
            startHour="07:00"
            endHour="20:00"
            workHours={{
                highlight: true, start: '09:00', end: '18:00'
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
    </>
}

export default CustomScheduler;