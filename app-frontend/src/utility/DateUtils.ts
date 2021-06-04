import moment from "jalali-moment"

export default class DateUtils {

    private constructor() {
    }

    static getCurrentDate(offsetDays?: number) {
        return moment(new Date()).set({hour: 0, minute: 0, second: 0, millisecond: 0})
            .add(offsetDays ?? 0, "days").toDate();
    }

    static addDays(date: Date | moment.Moment, days: number) {
        return moment(date).add(days, "days").toDate();
    }

}
