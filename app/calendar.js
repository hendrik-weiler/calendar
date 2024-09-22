import CalendarDate from "./calendarDate.js";

export default class Calendar {

    options = {};

    static MONTH = 1;

    static WEEK = 2;

    constructor(options) {
        this.options = Object.assign({
            canvas : document.body,
            mode : Calendar.MONTH,
            date : new CalendarDate(1, 1, 1970),
            labels : {
                days : ['Monday','Tuesday','Wednesday', 'Thursday','Friday','Saturday','Sunday'],
                months : ['January','February','March','April','May','June','July','August','September','October','November','December'],
                controls : {
                    previous : 'Previous',
                    next : 'Next'
                }
            }
        }, options);
    }

    createMonthDay(monthElm, dayObj) {
        let dayContainer = document.createElement('div'),
            dayElm = document.createElement('span');
        dayContainer.classList.add('calendar-day');
        if(dayObj.mode === 0) {
            dayContainer.classList.add('not-current-month');
        }
        if(dayObj.current) {
            dayContainer.classList.add('calendar-today');
        }
        dayElm.innerText = dayObj.day;
        dayElm.classList.add('calendar-day-number');
        dayContainer.appendChild(dayElm);
        monthElm.appendChild(dayContainer);
    }

    monthlyView(month) {
        let lastDayOfMonth = new Date(this.options.date.year,month,0),
            d = new Date(this.options.date.year,month,1),
            currentDate = new Date(),
            lastDayOfLastMonth = new Date(this.options.date.year,month-1,0),
            i = 1,
            j = 0,
            days = [],
            dayLabelElm,
            optionsContainer = document.createElement('div'),
            daysContainer = document.createElement('div'),
            weekContainer = document.createElement('div'),
            dayLabelContainer = document.createElement('div'),
            previousMonthElm = document.createElement('a'),
            nextMonthElm = document.createElement('a'),
            monthCurrentLabelElm = document.createElement('span'),
            updateCurrentLabel = (month, year) => {
                monthCurrentLabelElm.innerText = `${this.options.labels.months[month]} ${year}`;
            };

        monthCurrentLabelElm.classList.add('calendar-month-current-label');

        previousMonthElm.href = 'javascript:';
        previousMonthElm.classList.add('calendar-controls-month-previous');
        previousMonthElm.innerText = this.options.labels.controls.previous;
        previousMonthElm.onclick = () => {
            this.options.date.month -= 1;
            if(this.options.date.month < 1) {
                this.options.date.month = 12;
                this.options.date.year -= 1;
            }
            updateCurrentLabel(this.options.date.month-1, this.options.date.year);
            this.monthlyView(this.options.date.month);
        }

        nextMonthElm.href = 'javascript:';
        nextMonthElm.classList.add('calendar-controls-month-next');
        nextMonthElm.innerText = this.options.labels.controls.next;
        nextMonthElm.onclick = () => {
            this.options.date.month += 1;
            if(this.options.date.month > 12) {
                this.options.date.month = 1;
                this.options.date.year += 1;
            }
            updateCurrentLabel(this.options.date.month-1, this.options.date.year);
            this.monthlyView(this.options.date.month);
        }

        updateCurrentLabel(this.options.date.month-1, this.options.date.year);

        optionsContainer.appendChild(previousMonthElm);
        optionsContainer.appendChild(monthCurrentLabelElm);
        optionsContainer.appendChild(nextMonthElm);

        dayLabelContainer.classList.add('calendar-day-labels-container');
        weekContainer.classList.add('calendar-week-container');
        optionsContainer.classList.add('calendar-options');
        daysContainer.classList.add('calendar-days-container');
        for(; j < 7; ++j) {
            dayLabelElm = document.createElement('div');
            dayLabelElm.classList.add('calendar-day-label');
            dayLabelElm.innerText = this.options.labels.days[j];
            dayLabelContainer.appendChild(dayLabelElm);
        }

        // get days for last month
        let s = new Date(lastDayOfLastMonth),
            dayNumber = s.getDay(),
            counter = 0;
        if(dayNumber===1) {
            counter++;
        }
        while (dayNumber!==1) {
            dayNumber = s.getDay();
            s.setDate(s.getDate()-1);
            counter++;
        }
        if(counter < 7) {
            for(i=lastDayOfLastMonth.getDate()-counter; i < lastDayOfLastMonth.getDate(); ++i) {
                days.push({
                    mode : 0,
                    day : i+1,
                    current : false
                });
            }
        }
        // get days for current month
        for(i=1; i < lastDayOfMonth.getDate()+1; ++i) {
            days.push({
                mode : 1,
                day : i,
                current : i === currentDate.getDate()
                    && this.options.date.year === currentDate.getFullYear()
                    && this.options.date.month === currentDate.getMonth()+1
            });
        }

        // get days for next month
        s = new Date(lastDayOfMonth);
        s.setDate(1);
        s.setMonth(s.getMonth()+1);
        dayNumber = s.getDay();
        counter = 0;
        if(dayNumber===0) {
            counter++;
        }
        while (dayNumber!==0) {
            dayNumber = s.getDay();
            s.setDate(s.getDate()+1);
            counter++;
        }
        if(counter < 7) {
            for(i=0; i < counter; ++i) {
                days.push({
                    mode : 0,
                    day : i+1,
                    current : false
                });
            }
        }

        for(i=0; i < days.length; ++i) {
            if(i % 7 === 0 || i === days.length-1) {
                daysContainer.appendChild(weekContainer);
                if(i === days.length-1) {
                    this.createMonthDay(weekContainer, days[i]);
                }
                weekContainer = document.createElement('div')
                weekContainer.classList.add('calendar-week-container');
            }
            this.createMonthDay(weekContainer, days[i]);
        }
        this.options.canvas.innerHTML = '';
        this.options.canvas.appendChild(optionsContainer);
        this.options.canvas.appendChild(dayLabelContainer);
        this.options.canvas.appendChild(daysContainer);
    }

    render() {
        this.monthlyView(this.options.date.month);
    }

}