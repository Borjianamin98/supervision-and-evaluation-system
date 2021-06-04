export default class NumberUtils {

    private static readonly PERSIAN_NUMBER_ORDER_NAMES = [
        "صفرم",
        "اول",
        "دوم",
        "سوم",
        "چهارم",
        "پنجم",
        "ششم",
        "هفتم",
        "هشتم",
        "نهم",
        "دهم"
    ];

    private constructor() {
    }

    static mapNumberToPersianOrderName(number: number) {
        return (NumberUtils.PERSIAN_NUMBER_ORDER_NAMES)[number];
    }

}
