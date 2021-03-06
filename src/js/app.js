import { settings, select, classNames } from './settings.js';
import Product from './components/Product.js';
import Cart from './components/Cart.js';
import Booking from './components/Booking.js';

const app = {
  initPages: function () {
    const thisApp = this;

    thisApp.pages = document.querySelector(select.containerOf.pages).children;
    thisApp.navLinks = document.querySelectorAll(select.nav.links);
    thisApp.mainLinks = document.querySelectorAll(select.main_links.links);

    const idFromHash = window.location.hash.replace('#/', '');
    console.log('idFromHash', idFromHash);

    let pageMatchingHash = thisApp.pages[0].id;

    for (let page of thisApp.pages) {
      if (page.id == idFromHash) {
        pageMatchingHash = page.id;
        break;
      }
    }

    thisApp.activatePage(/*thisApp.pages[0].id*//*idFromHash*/pageMatchingHash);
    // console.log('pageMatchingHash', pageMatchingHash);

    for (let link of thisApp.navLinks) {
      link.addEventListener('click', function (event) {
        const clickedElement = this;
        event.preventDefault();

        /* get page id from href attribute */
        const id = clickedElement.getAttribute('href').replace('#', '');
        /* run thisApp.activatepage with that id */
        thisApp.activatePage(id);

        /* change URL hash */
        window.location.hash = '#/' + id;
      });
    }

    //added below for links from main page module 11.3:
    for (let link of thisApp.mainLinks) {
      link.addEventListener('click', function (event) {
        const clickedElement = this;
        event.preventDefault();

        /* get page id from href attribute */
        const id = clickedElement.getAttribute('href').replace('#', '');
        /* run thisApp.activatepage with that id */
        thisApp.activatePage(id);

        /* change URL hash */
        window.location.hash = '#/' + id;
      });
    }
  },

  initBooking: function () {
    const thisApp = this;
    /* find container of widget for table booking */
    // thisApp.widgetContainer = document.querySelector(select.containerOf.booking);
    const widgetContainer = document.querySelector(select.containerOf.booking);
    // console.log('widgetContainer', widgetContainer);
    /* create new instance of Booking class */
    thisApp.Booking = new Booking(widgetContainer);
  },

  activatePage: function (pageId) {
    const thisApp = this;

    const cartContainer = document.querySelector(select.containerOf.cart);
    const mainNavContainer = document.querySelector(select.containerOf.main_nav);
    // console.log('cartContainer', cartContainer);
    /* add class active to matching pages, remove from non-matching */
    for (let page of thisApp.pages) {
      //Poczatek zmian dla modułu 11.3
      // page.classList.toggle(classNames.pages.active, page.id == pageId);
      if (page.id == pageId && pageId == 'main') {
        page.classList.add(classNames.pages.active/*, page.id == pageId*/);
        // page.classList.remove(classNames.pages.active, page.id != pageId);
        cartContainer.classList.add(classNames.cart.inactive);
        mainNavContainer.classList.add(classNames.nav.inactive);
        // console.log('weszlismy w 1 ifa');
      }
      else {
        // console.log('weszlismy w else ifa');
        page.classList.toggle(classNames.pages.active, page.id == pageId);
        if (page.id == pageId && pageId != 'main') {
          cartContainer.classList.remove(classNames.cart.inactive);
          mainNavContainer.classList.remove(classNames.nav.inactive);
        }
      }
      //Koniec zmian dla modułu 11.3
    }
    /* add class active to matching links, remove from non-matching */
    for (let link of thisApp.navLinks) {
      link.classList.toggle(
        classNames.nav.active,
        link.getAttribute('href') == '#' + pageId
      );
    }
  },

  initCart: function () {
    const thisApp = this;

    const cartElem = document.querySelector(select.containerOf.cart);
    thisApp.cart = new Cart(cartElem);

    thisApp.productList = document.querySelector(select.containerOf.menu);

    thisApp.productList.addEventListener('add-to-cart', function (event) {
      app.cart.add(event.detail.product);
    });
  },
  initMenu: function () {
    const thisApp = this;

    // console.log('thisApp.data: ', thisApp.data);

    for (let productData in thisApp.data.products) {
      // new Product(productData, thisApp.data.products[productData]);
      new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]);
    }
  },
  initData: function () {
    const thisApp = this;

    // thisApp.data = dataSource;
    thisApp.data = {};

    const url = settings.db.url + '/' + settings.db.product;

    fetch(url)
      .then(function (rawResponse) {
        return rawResponse.json();
      })
      .then(function (parsedResponse) {
        // console.log('parsedResponse', parsedResponse);

        /* save parsedResponse as thisApp.data.products */
        thisApp.data.products = parsedResponse;

        /* execute initMenu method */
        thisApp.initMenu();
      });

    // console.log('thisApp.data', JSON.stringify(thisApp.data));
  },
  init: function () {
    const thisApp = this;
    // console.log('*** App starting ***');
    // console.log('thisApp:', thisApp);
    // console.log('classNames:', classNames);
    // console.log('settings:', settings);
    // console.log('templates:', templates);

    thisApp.initPages();
    thisApp.initData();
    // thisApp.initMenu();
    thisApp.initCart();
    thisApp.initBooking();
  },
};


app.init();
