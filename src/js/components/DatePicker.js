/* global flatpickr */

import BaseWidget from './BaseWidget.js';
import { utils } from '../utils.js';
import { select, settings } from '../settings.js';
class DatePicker extends BaseWidget {

  constructor(wrapper) {
    super(wrapper, utils.dateToStr(new Date()));

    const thisWidget = this;

    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.datePicker.input);

    thisWidget.initPlugin();

  }

  initPlugin() {
    const thisWidget = this;

    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.datePicker.input);

    thisWidget.minDate = new Date(thisWidget.value);
    thisWidget.maxDate = utils.addDays(thisWidget.minDate, settings.datePicker.maxDaysInFuture);

    /* inicjalizacja pluginu flatpickr */
    // let datePicked =
    flatpickr(thisWidget.dom.input, {
      defaultDate: thisWidget.minDate,
      minDate: thisWidget.minDate,
      maxDate: thisWidget.maxDate,
      locale: {
        firstDayOfWeek: 1 // start week on Monday
      },
      disable: [
        function (date) {
          // return true to disable
          return (date.getDay() === 1);

        }
      ],
      onChange: function () {
        thisWidget.value = thisWidget.dom.input.value;
        console.log('thisWidget.value on change', thisWidget.value);
      },
    });

    // thisWidget.value = datePicked;
    // console.log('thisWidget.value from datepicked', thisWidget.value);

    // datePicked.onChange(thisWidget.dom.input, thisWidget.dom.input.value);
    // console.log('thisWidget.value', thisWidget.value);

  }

  parseValue(value) {
    return value;
  }

  isValid() {
    return true;
  }

  renderValue() {
    // const thisWidget = this;

    // thisWidget.dom.wrapper.innerHtml = thisWidget.value;
  }

}

export default DatePicker;
