class BaseWidget {
  constructor(wrapperElement, initialValue) {
    const thisWidget = this;

    thisWidget.dom = {};
    thisWidget.dom.wrapper = wrapperElement;

    thisWidget.correctValue = initialValue;
  }

  get value() {
    const thisWidget = this;

    return thisWidget.correctValue;
  }

  //metoda setValue służy do ustawiania wartości widgetu pod warunkiem, że jest to prawidłowa wartość, czyli mieści się w zakresie
  set value(value) {
    const thisWidget = this;

    const newValue = thisWidget.parseValue(value);
    /* Add validation */

    if (newValue !== thisWidget.correctValue
      && thisWidget.isValid(value)/*newValue >= settings.amountWidget.defaultMin
      && newValue <= settings.amountWidget.defaultMax*/) {
      thisWidget.correctValue = newValue;
      thisWidget.announce();
    }
    // thisWidget.dom.input.value = thisWidget.correctValue;
    thisWidget.renderValue();
  }

  setValue(value) {
    const thisWidget = this;

    thisWidget.value = value;

  }

  parseValue(value) {
    return parseInt(value);
  }

  isValid(value) {
    return !isNaN(value);
  }

  renderValue() {
    const thisWidget = this;

    thisWidget.dom.wrapper.innerHtml = thisWidget.value;
  }

  announce() {
    const thisWidget = this;

    // const event = new Event('updated');
    const event = new CustomEvent('updated', {
      bubbles: true
    });
    thisWidget.dom.wrapper.dispatchEvent(event);
  }
}

export default BaseWidget;
