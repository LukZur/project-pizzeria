import { templates, select } from '../settings.js';
import { utils } from '../utils.js';
import AmountWidget from './AmountWidget.js';

class Booking {

  constructor(widgetContainer) {
    const thisBooking = this;

    thisBooking.render(widgetContainer);

    thisBooking.initWidgets();
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

    console.log('thisBooking.dom.wrapper', thisBooking.dom.wrapper);

    // const x = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);//document.querySelector(select.booking.peopleAmount);

    /* assign value to thisBooking.dom.peopleAmount */
    // console.log('document.querySelector(select.Booking.peopleAmount)', x);
    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount); //thisBooking.dom.wrapper.querySelector(select.Booking.peopleAmount);

    /* assign value to thisBooking.dom.hoursAmount */
    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);

  }

  initWidgets() {
    const thisBooking = this;

    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);

  }



}

export default Booking;
