/**
 * EventManager - consumes config.js, sets handlers for users' actions
 */

import SubjectObserver from "./SubjectObserver";

export default class EventManager extends SubjectObserver {
  constructor(ObserverList) {
    super(ObserverList);
    this.total = 0;
    this.isBusy = false;
    this.imgLoadFunc = 'lazyLoad';
    this.noImgClass = 'no-image';
    this.delay = 500;
  }
  setTotal(total) {
    this.total = total;
  }
  toggleBusy() {
    this.isBusy = !this.isBusy;
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
      window[this.imgLoadFunc] = (elem) => this.imgLoadHandler(elem);
      window.onerror = (msg) => {
        this.notify('showError', new Error(msg));
      }

      document.getElementById(this.appId).addEventListener('click', event => {
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
      elem.classList.toggle(this.noImgClass);
      elem.removeAttribute('data-image');
    }
    img.src = url;
  }
  itemDelHandler(elem) {
    if(this.isBusy) return false;
    this.toggleBusy();
    elem.classList.toggle(this.loadingClass);
    let data = {
      id: elem.getAttribute('data-delete'),
      elem: elem
    };
    setTimeout(() => {
      this.notify('removeElem', data);
      this.toggleBusy();
    }, this.delay);
  }
  itemsDownloadHandler(elem, storageManager) {
    if(this.isBusy) return false;
    this.toggleBusy();
    elem.classList.toggle(this.loadingClass);
    let loadedItems = [].slice.call(document.getElementById(this.itemsId).children).length;
    if(this.total > loadedItems) {
      setTimeout(() => {
        this.notify('showMore', storageManager.restore());
        elem.classList.toggle(this.loadingClass);
        if(loadedItems + this.perRow >= this.total) elem.setAttribute('disabled', 'disabled');
        this.toggleBusy();
      }, this.delay);
    }
  }
}
