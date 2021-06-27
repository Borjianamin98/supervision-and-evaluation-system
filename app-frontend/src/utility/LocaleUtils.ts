import filesize from "filesize";

export default class LocaleUtils {

    private constructor() {
    }

    static convertToPersianDigits(str: string | number) {
        return str.toString()
            .replaceAll("0", "۰")
            .replaceAll("1", "۱")
            .replaceAll("2", "۲")
            .replaceAll("3", "۳")
            .replaceAll("4", "۴")
            .replaceAll("5", "۵")
            .replaceAll("6", "۶")
            .replaceAll("7", "۷")
            .replaceAll("8", "۸")
            .replaceAll("9", "۹");
    }

    static convertToEnglishDigits(str: string) {
        return str
            .replaceAll("۰", "0")
            .replaceAll("۱", "1")
            .replaceAll("۲", "2")
            .replaceAll("۳", "3")
            .replaceAll("۴", "4")
            .replaceAll("۵", "5")
            .replaceAll("۶", "6")
            .replaceAll("۷", "7")
            .replaceAll("۸", "8")
            .replaceAll("۹", "9");
    }

    static convertFileSizeToPersian(size: number) {
        return filesize(size, {
            round: 1,
            locale: "fa",
            standard: "jedec",
            symbols: {
                B: "بایت",
                KB: "کیلوبایت",
                MB: "مگابایت",
                GB: "گیگابایت",
                TB: "ترابایت",
                PB: "پتابایت",
                EB: "اگزابایت",
                ZB: "زتابایت",
                YB: "یتابایت"
            }
        })
    }

}
