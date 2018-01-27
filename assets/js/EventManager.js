/**
 * EventManager - consumes config.js, sets handlers for users' actions
 */

import Manager from "./Manager";

export default class EventManager extends Manager {
  constructor(ObserverList) {
    super(ObserverList);
    this.settings.isBusy = false;
    this.settings.imgLoadFunc = 'lazyLoad';
    this.settings.noImgClass = 'no-image';
    this.settings.delay = 500;
  }
  toggleBusy() {
    this.settings.isBusy = !this.settings.isBusy;
  }
  defer(elem, msg, data) {
    setTimeout(() => {
      elem.classList.toggle(this.settings.loadingClass);
      this.notify(msg, data);
      this.toggleBusy();
    }, this.settings.delay);
  }
  // carries out Subject-Observer relashionships defined in config.js
  setObservers(config) {
    config.forEach(subject => {
      subject.notifies.forEach(evt => {
        evt.observers.forEach(observer => {
          subject.instance.addObserver(evt.name, observer.instance, observer.callback);
        });
      });
    });
  }
  // App's behaviour. After getting users' behaviour data notifies dependants for main actions
  setEventHandlers(storageManager) {
      window[this.settings.imgLoadFunc] = (elem) => this.imgLoadHandler(elem);
      window.onerror = (msg) => this.notify('showError', new Error(msg));

      document.getElementById(this.settings.appId).addEventListener('click', event => {
        let e = event || window.event, elem = e.target || e.srcElement;
        if(elem.tagName.toLowerCase() !== 'button' || elem.disabled == true) return false;

        if(elem.hasAttribute('data-download')) this.itemsDownloadHandler(elem, storageManager);
        if(elem.hasAttribute('data-delete')) this.itemDelHandler(elem);
      });
  }
  imgLoadHandler(elem) {
    let url = elem.getAttribute('data-image');
    let img = new Image();
    img.onload = () => {
      elem.src = url;
      elem.onload = null;
      elem.removeAttribute('onload');
      elem.classList.toggle(this.settings.noImgClass);
      elem.removeAttribute('data-image');
    }
    img.src = url;
  }
  itemDelHandler(elem) {
    if(this.settings.isBusy) return false;
    this.toggleBusy();
    elem.classList.toggle(this.settings.loadingClass);
    let data = {
      id: elem.getAttribute('data-delete'),
      elem: elem
    };
    this.defer(elem, 'removeElem', data);
  }
  itemsDownloadHandler(elem, storageManager) {
    if(this.settings.isBusy) return false;
    this.toggleBusy();
    elem.classList.toggle(this.settings.loadingClass);
    let loadedItems = [].slice.call(document.getElementById(this.settings.itemsId).children).length;
    if(Manager.total > loadedItems) {
      if(loadedItems + this.settings.perRow >= Manager.total) elem.setAttribute('disabled', 'disabled');
      this.defer(elem, 'showMore', storageManager.restore());
    }
  }
}
