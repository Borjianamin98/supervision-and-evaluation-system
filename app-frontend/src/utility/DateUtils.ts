import moment from "moment";

export default class DateUtils {

    private constructor() {
    }

    static getCurrentDate(offsetDays?: number) {
        return DateUtils.firstOfDay(new Date()).add(offsetDays ?? 0, "days");
    }

    static addDays(date: Date | moment.Moment, days: number) {
        return moment(date).add(days, "days");
    }

    static firstOfDay(date: Date | moment.Moment) {
        return moment(date).set({hour: 0, minute: 0, second: 0, millisecond: 0});
    }

    static endOfDay(date: Date | moment.Moment) {
        return moment(date).set({hour: 23, minute: 59, second: 59, millisecond: 999});
    }
}
