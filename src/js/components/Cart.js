import { settings, select, classNames, templates } from '../settings.js';
import { utils } from '../utils.js';
import CartProduct from './CartProduct.js';

class Cart {
  constructor(element) {
    const thisCart = this;

    thisCart.products = [];
    thisCart.deliveryFee = settings.cart.defaultDeliveryFee;

    thisCart.getElements(element);
    thisCart.initActions();

    // console.log('new Cart', thisCart);
  }

  getElements(element) {
    const thisCart = this;

    thisCart.dom = {};

    thisCart.dom.wrapper = element;
    thisCart.dom.form = thisCart.dom.wrapper.querySelector(select.cart.form);
    thisCart.dom.phone = thisCart.dom.wrapper.querySelector(select.cart.phone);
    thisCart.dom.address = thisCart.dom.wrapper.querySelector(select.cart.address);
    // thisCart.dom.totalNumber = thisCart.dom.wrapper.querySelector(select.cart.totalNumber);
    // thisCart.dom.subtotalPrice = thisCart.dom.wrapper.querySelector(select.cart.subtotalPrice);
    // thisCart.dom.totalPrice = thisCart.dom.wrapper.querySelector(select.cart.totalPrice);
    // thisCart.dom.deliveryFee = thisCart.dom.wrapper.querySelector(select.cart.deliveryFee);

    thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger);
    thisCart.dom.productList = thisCart.dom.wrapper.querySelector(select.cart.productList);

    thisCart.renderTotalsKeys = ['totalNumber', 'totalPrice', 'subtotalPrice', 'deliveryFee'];

    for (let key of thisCart.renderTotalsKeys) {
      thisCart.dom[key] = thisCart.dom.wrapper.querySelectorAll(select.cart[key]);
    }

  }

  initActions() {
    const thisCart = this;

    thisCart.dom.toggleTrigger.addEventListener('click', function () {
      if (thisCart.dom.wrapper.classList.contains(classNames.cart.wrapperActive)) {
        thisCart.dom.wrapper.classList.remove(classNames.cart.wrapperActive);
      }
      else {
        thisCart.dom.wrapper.classList.add(classNames.cart.wrapperActive);
      }
    });

    thisCart.dom.productList.addEventListener('updated', function () {
      thisCart.update();
    });
    thisCart.dom.productList.addEventListener('remove', function (event) {
      event.preventDefault();
      thisCart.remove(event.detail.cartProduct);
      console.log('product removed');
    });
    thisCart.dom.form.addEventListener('submit', function (event) {
      event.preventDefault();
      thisCart.sendOrder();
    });

  }
  add(menuProduct) {
    const thisCart = this;

    /* generate HTML based on template */
    const generatedHTML = templates.cartProduct(menuProduct);
    console.log('generatedHTML', generatedHTML);

    /* create DOM element */
    const generateDOM = utils.createDOMFromHTML(generatedHTML);
    console.log('generateDOM', generateDOM);

    /* add element to cart */
    thisCart.dom.productList.appendChild(generateDOM);
    console.log('thisCart.dom.productList', thisCart.dom.productList);

    console.log('adding product to cart');

    thisCart.products.push(new CartProduct(menuProduct, generateDOM));
    console.log('thisCart.products', thisCart.products);

    thisCart.update();
  }

  update() {
    const thisCart = this;

    thisCart.totalNumber = 0;
    thisCart.subtotalPrice = 0;

    for (this.cartProduct of thisCart.products) {
      // console.log('cartProduct', this.cartProduct);
      thisCart.subtotalPrice += this.cartProduct.price;
      thisCart.totalNumber += this.cartProduct.amount;
    }

    thisCart.totalPrice = thisCart.subtotalPrice + thisCart.deliveryFee;

    console.log('totalNumber', thisCart.totalNumber);
    console.log('subtotalPrice', thisCart.subtotalPrice);
    console.log('thisCart.totalPrice', thisCart.totalPrice);

    for (let key of thisCart.renderTotalsKeys) {
      for (let elem of thisCart.dom[key]) {
        elem.innerHTML = thisCart[key];
      }
    }
  }

  remove(cartProduct) {
    const thisCart = this;
    // const elm = thisCart.dom.productList;
    console.log('thisCart', thisCart);
    const index = thisCart.products.indexOf(cartProduct);
    thisCart.products.splice(index, 1);
    // console.log('thisCart.dom.productList', thisCart.dom.productList);
    // console.log('this.cartProduct.dom.wrapper', cartProduct.dom.wrapper);
    // thisCart.dom.productList.classList.remove(cartProduct.dom.wrapper);
    // console.log('elm.classList', elm.classList);
    // elm.classList.remove(this.cartProduct.dom.wrapper);
    // console.log('cartProduct.dom.wrapper', cartProduct.dom.wrapper);
    cartProduct.dom.wrapper.remove();
    thisCart.update();
  }

  sendOrder() {
    const thisCart = this;
    const url = settings.db.url + '/' + settings.db.order;

    // console.log('thisCart.dom.phone', thisCart.dom.phone.value);
    // console.log('thisCart.dom.address', thisCart.dom.address.value);

    const payload = {
      env_address: 'test',
      totalPrice: thisCart.totalPrice,
      phone: thisCart.dom.phone.value,
      address: thisCart.dom.address.value,
      totalNumber: thisCart.totalNumber,
      subtotalPrice: thisCart.subtotalPrice,
      deliveryFee: thisCart.deliveryFee,
      products: [],
    };

    // console.log('thisCart.payload', thisCart.payload);
    // console.log('thisCart.payload.products', thisCart.payload.products);

    for (let oneProduct of thisCart.products) {
      // thisCart.payload.products.push(thisCart.products[oneProduct].getData());
      // console.log('thisCart.products[oneProduct]', thisCart.products[oneProduct]);
      // console.log('thisCart.products[oneProduct].getData()', thisCart.products[oneProduct].getData());

      console.log('oneProduct.getData()', oneProduct.getData());
      payload.products.push(oneProduct.getData());
    }

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    fetch(url, options)
      .then(function (response) {
        return response.json();
      }).then(function (parsedResponse) {
        console.log('parsedResponse', parsedResponse);
      });

  }
}

export default Cart;
