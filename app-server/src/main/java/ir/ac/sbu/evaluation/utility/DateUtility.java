package ir.ac.sbu.evaluation.utility;

import java.sql.Date;
import java.time.Instant;
import java.util.Calendar;
import java.util.TimeZone;

public class DateUtility {

    private static final Calendar calendar = Calendar.getInstance(TimeZone.getDefault());

    private DateUtility() {
    }

    public static Instant getStartOfDay(Instant instant) {
        calendar.setTime(Date.from(instant));
        calendar.set(Calendar.MILLISECOND, 0);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        return calendar.toInstant();
    }

}
