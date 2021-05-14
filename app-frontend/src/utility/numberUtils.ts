export const PERSIAN_NUMBER_ORDER_NAMES = [
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

export const mapNumberToPersianOrderName = (number: number) => {
    return PERSIAN_NUMBER_ORDER_NAMES[number];
}