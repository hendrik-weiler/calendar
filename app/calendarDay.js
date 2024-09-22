import CalendarDate from "./calendarDate";

export default class CalendarDay {

    date = null;

    entries = [];

    constructor(day, month, year) {
        this.date = new CalendarDate(day, month, year);
    }

}