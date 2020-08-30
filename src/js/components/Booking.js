import { templates, select, settings, classNames } from '../settings.js';
import { utils } from '../utils.js';
import AmountWidget from './AmountWidget.js';
import DatePicker from './DatePicker.js';
import HourPicker from './HourPicker.js';

class Booking {

  constructor(widgetContainer) {
    const thisBooking = this;

    thisBooking.render(widgetContainer);

    thisBooking.initWidgets();
    thisBooking.getData();
    thisBooking.initActions();

    thisBooking.selectedTable;
  }

  getData() {

    const thisBooking = this;

    const startDateParam = settings.db.dateStartParamKey + '=' + utils.dateToStr(thisBooking.datePicker.minDate);
    const endDateParam = settings.db.dateEndParamKey + '=' + utils.dateToStr(thisBooking.datePicker.maxDate);

    const params = {
      booking: [
        startDateParam,
        endDateParam,
      ],
      eventsCurrent: [
        settings.db.notRepeatParam,
        startDateParam,
        endDateParam,
      ],
      eventsRepeat: [
        settings.db.repeatParam,
        endDateParam,
      ],
    };

    // console.log('getData params', params);

    const urls = {
      booking: settings.db.url + '/' + settings.db.booking
        + '?' + params.booking.join('&'),
      eventsCurrent: settings.db.url + '/' + settings.db.event
        + '?' + params.eventsCurrent.join('&'),
      eventsRepeat: settings.db.url + '/' + settings.db.event
        + '?' + params.eventsRepeat.join('&'),
    };

    // console.log('getData urls', urls);

    Promise.all([
      fetch(urls.booking),
      fetch(urls.eventsCurrent),
      fetch(urls.eventsRepeat),
    ])
      .then(function (allResponses) {
        const bookingsResponse = allResponses[0];
        const eventsCurrentResponse = allResponses[1];
        const eventsRepeatResponse = allResponses[2];
        return Promise.all([
          bookingsResponse.json(),
          eventsCurrentResponse.json(),
          eventsRepeatResponse.json(),
        ]);
      })
      .then(function ([bookings, eventsCurrent, eventsRepeat]) {
        // console.log(bookings);
        // console.log(eventsCurrent);
        // console.log(eventsRepeat);
        thisBooking.parseData(bookings, eventsCurrent, eventsRepeat);
      });
  }

  parseData(bookings, eventsCurrent, eventsRepeat) {
    const thisBooking = this;

    thisBooking.booked = {};

    for (let item of bookings) {
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }

    for (let item of eventsCurrent) {
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }

    const minDate = thisBooking.datePicker.minDate;
    const maxDate = thisBooking.datePicker.maxDate;

    for (let item of eventsRepeat) {
      if (item.repeat == 'daily') {
        for (let loopDate = minDate; loopDate <= maxDate; loopDate = utils.addDays(loopDate, 1)) {
          thisBooking.makeBooked(utils.dateToStr(loopDate), item.hour, item.duration, item.table);
        }
      }
    }

    // console.log('thisBooking.booked', thisBooking.booked);

    thisBooking.updateDOM();
  }

  makeBooked(date, hour, duration, table) {
    const thisBooking = this;

    if (typeof thisBooking.booked[date] == 'undefined') {
      thisBooking.booked[date] = {};
    }

    const startHour = utils.hourToNumber(hour);



    for (let hourBlock = startHour; hourBlock < startHour + duration; hourBlock += 0.5) {
      // console.log('loop', hourBlock);
      if (typeof thisBooking.booked[date][hourBlock] == 'undefined') {
        thisBooking.booked[date][hourBlock] = [];
      }

      thisBooking.booked[date][hourBlock].push(table);
    }
  }

  updateDOM() {
    const thisBooking = this;

    thisBooking.date = thisBooking.datePicker.value;
    thisBooking.hour = utils.hourToNumber(thisBooking.hourPicker.value);

    let allAvailable = false;

    if (
      typeof thisBooking.booked[thisBooking.date] == 'undefined'
      ||
      typeof thisBooking.booked[thisBooking.date][thisBooking.hour] == 'undefined'
    ) {
      allAvailable = true;
    }

    for (let table of thisBooking.dom.tables) {
      let tableId = table.getAttribute(settings.booking.tableIdAttribute);
      if (!isNaN(tableId)) {
        tableId = parseInt(tableId);
      }

      if (
        !allAvailable
        &&
        thisBooking.booked[thisBooking.date][thisBooking.hour].includes(tableId)
      ) {
        table.classList.add(classNames.booking.tableBooked);
      } else {
        table.classList.remove(classNames.booking.tableBooked);
      }
    }
    console.log('booked z updateDOM', thisBooking.booked);
  }

  render(widgetContainer) {
    const thisBooking = this;

    /* generate HTML based on template */
    const generatedHTML = templates.bookingWidget(widgetContainer);
    // console.log('generatedHTML booking', generatedHTML);

    /* create DOM element */
    const generateDOM = utils.createDOMFromHTML(generatedHTML);
    // console.log('generateDOM booking', generateDOM);

    /* create empty object thisBooking.dom */
    thisBooking.dom = {};
    /* assign generated HTML code to wrapper */
    thisBooking.dom.wrapper = widgetContainer;
    thisBooking.dom.wrapper.appendChild(generateDOM);

    // console.log('thisBooking.dom.wrapper', thisBooking.dom.wrapper);

    // const x = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);//document.querySelector(select.booking.peopleAmount);

    /* assign value to thisBooking.dom.peopleAmount */
    // console.log('document.querySelector(select.Booking.peopleAmount)', x);
    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount); //thisBooking.dom.wrapper.querySelector(select.Booking.peopleAmount);

    /* assign value to thisBooking.dom.hoursAmount */
    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);

    /* Adding datePicker */
    thisBooking.dom.datePicker = thisBooking.dom.wrapper.querySelector(select.widgets.datePicker.wrapper);

    /* Adding hourPicker */
    thisBooking.dom.hourPicker = thisBooking.dom.wrapper.querySelector(select.widgets.hourPicker.wrapper);

    thisBooking.dom.tables = thisBooking.dom.wrapper.querySelectorAll(select.booking.tables);

    thisBooking.dom.phone = thisBooking.dom.wrapper.querySelector(select.booking.phone);
    thisBooking.dom.address = thisBooking.dom.wrapper.querySelector(select.booking.address);
    thisBooking.dom.hourPicker.output = thisBooking.dom.wrapper.querySelector(select.widgets.hourPicker.output);
    thisBooking.dom.starters = thisBooking.dom.wrapper.querySelectorAll('.checkbox input');
    thisBooking.dom.peopleAmount.input = thisBooking.dom.wrapper.querySelector('.people-amount input.amount');
    thisBooking.dom.hoursAmount.input = thisBooking.dom.wrapper.querySelector('.hours-amount input.amount');

    // console.log(thisBooking.dom.datePicker.value, 'thisBooking.dom.datePicker');

  }

  initWidgets() {
    const thisBooking = this;

    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);

    thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
    thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);

    thisBooking.dom.wrapper.addEventListener('updated', function () {
      thisBooking.updateDOM();
    });

  }

  initActions() {
    const thisBooking = this;


    // thisBooking.dom.starters = document.getElementsByName('starters').getAttribute('value');
    // console.log('thisBooking.dom.starters', thisBooking.dom.starters);

    for (let clikableTable of thisBooking.dom.tables) {
      clikableTable.addEventListener('click', function () {
        clikableTable.classList.add(classNames.booking.tableBooked);

        let tableId = clikableTable.getAttribute(settings.booking.tableIdAttribute);
        thisBooking.selectedTable = tableId;
      });
    }
    /* remove active class from the available table after date pr hour is changed */

    thisBooking.dom.form = thisBooking.dom.wrapper.querySelector(select.booking.form);

    thisBooking.dom.form.addEventListener('submit', function () {
      event.preventDefault();
      thisBooking.sendBooking();
    });
  }

  sendBooking() {
    const thisBooking = this;
    const url = settings.db.url + '/' + settings.db.booking;

    const payload = {
      date: thisBooking.dom.datePicker.value,
      hour: thisBooking.dom.hourPicker.output.innerHTML,
      table: parseInt(thisBooking.selectedTable),
      duration: parseInt(thisBooking.dom.hoursAmount.input.value),
      ppl: parseInt(thisBooking.dom.peopleAmount.input.value),
      starters: [],
      phone: thisBooking.dom.phone.value,
      address: thisBooking.dom.address.value,
    };

    for (let pickedStarter of thisBooking.dom.starters) {
      if (pickedStarter.checked) {
        payload.starters.push(pickedStarter.value);
      }
    }

    console.log('payload', payload);

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };


    fetch(url, options)
      .then(function (response) {
        console.log(response);
        return response.json();
      }).then(function (parsedResponse) {
        console.log('parsedResponse', parsedResponse);
      });

    thisBooking.makeBooked(thisBooking.datePicker.value, thisBooking.dom.hourPicker.output.innerHTML, parseInt(thisBooking.dom.hoursAmount.input.value), parseInt(thisBooking.selectedTable));
    // thisBooking.updateDOM();

    // console.log(thisBooking.booked,'thisBooking.booked');
  }
}

export default Booking;
