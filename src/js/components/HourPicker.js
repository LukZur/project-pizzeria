/* global rangeSlider */

import BaseWidget from './BaseWidget.js';
import { utils } from '../utils.js';
import { select, settings } from '../settings.js';

class HourPicker extends BaseWidget {

  constructor(wrapper) {
    super(wrapper, settings.hours.open);

    const thisWidget = this;

    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.hourPicker.input);
    thisWidget.dom.output = thisWidget.dom.wrapper.querySelector(select.widgets.hourPicker.output);
    // console.log('thisWidget.dom.output', thisWidget.dom.output);
    // thisWidget.dom.output.innerHtml = '111111';
    // console.log('thisWidget.dom.input.value', thisWidget.dom.input.value);
    // console.log('thisWidget.dom.output.innerHtml', thisWidget.dom.output.innerHtml);

    thisWidget.initPlugin();

    thisWidget.value = thisWidget.dom.input.value;



  }

  initPlugin() {
    const thisWidget = this;

    rangeSlider.create(thisWidget.dom.input);



    thisWidget.dom.input.addEventListener('input', function () {
      thisWidget.value = thisWidget.dom.input.value;
      // console.log('thisWidget.dom.input.value', thisWidget.dom.input.value);
    });

  }

  parseValue(value) {
    return utils.numberToHour(value);
  }

  isValid() {
    return true;
  }

  renderValue() {
    const thisWidget = this;

    // console.log('thisWidget.value w render', thisWidget.value);
    // console.log('thisWidget.dom.output', thisWidget.dom.output);

    thisWidget.dom.output.innerHTML = thisWidget.value;
    // console.log('thisWidget.dom.output.innerHtml', thisWidget.dom.output.innerHtml);
  }


}

export default HourPicker;
