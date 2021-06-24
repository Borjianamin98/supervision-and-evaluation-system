package ir.ac.sbu.evaluation.utility;

public class LocaleUtility {

    private LocaleUtility() {
    }

    public static String convertToPersianDigits(String value) {
        return value
                .replace("0", "٠")
                .replace("1", "۱")
                .replace("2", "٢")
                .replace("3", "٣")
                .replace("4", "٤")
                .replace("5", "٥")
                .replace("6", "٦")
                .replace("7", "٧")
                .replace("8", "٨")
                .replace("9", "٩");
    }
}
