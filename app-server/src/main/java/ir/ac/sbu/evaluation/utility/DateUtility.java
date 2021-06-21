package ir.ac.sbu.evaluation.utility;

import com.ibm.icu.text.DateFormat;
import com.ibm.icu.text.SimpleDateFormat;
import com.ibm.icu.util.ULocale;
import java.sql.Date;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Calendar;
import java.util.TimeZone;

public class DateUtility {

    private DateUtility() {
    }

    public static Instant getStartOfDay(Instant instant) {
        Calendar calendar = Calendar.getInstance(TimeZone.getDefault());
        calendar.setTime(Date.from(instant));
        calendar.set(Calendar.MILLISECOND, 0);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        return calendar.toInstant();
    }

    public static Instant getEndOfDay(Instant instant) {
        Calendar calendar = Calendar.getInstance(TimeZone.getDefault());
        calendar.setTime(Date.from(instant));
        calendar.set(Calendar.MILLISECOND, 999);
        calendar.set(Calendar.SECOND, 59);
        calendar.set(Calendar.MINUTE, 59);
        calendar.set(Calendar.HOUR_OF_DAY, 23);
        return calendar.toInstant();
    }

    public static String getFullPersianDate(Instant instant) {
        return DateUtility.getPersianDate(instant, "EEEE، d MMMM YYYY (h:mm a)");
    }

    public static String getPersianDate(Instant instant, String format) {
        ULocale locale = new ULocale("fa_IR@calendar=persian");
        com.ibm.icu.util.Calendar calendar = com.ibm.icu.util.Calendar.getInstance(locale);
        calendar.setTime(java.util.Date.from(instant));
        DateFormat dateFormat = new SimpleDateFormat(format, locale);
        return dateFormat.format(calendar);
    }

    public static LocalDateTime convert(Instant instant) {
        return LocalDateTime.ofInstant(instant, ZoneId.systemDefault());
    }
}
