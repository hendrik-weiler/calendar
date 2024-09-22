export default class CalendarDate {

    day = 1;

    month = 1;

    year = 1970;

    constructor(day, month, year) {
        this.day = day;
        this.month = month;
        this.year = year;
    }

    static Current() {
        let d = new Date(),
            day = d.getDate(),
            month = d.getMonth()+1,
            year = d.getFullYear();
        return new CalendarDate(day, month, year);
    }

}