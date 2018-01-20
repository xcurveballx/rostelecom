/*
 * EventManager's  carries out Subject-Observer relashionships.
 */

import SubjectObserver from "./SubjectObserver";

export default class EventManager extends SubjectObserver {
  constructor(ObserverList) {
    super(ObserverList);
    this.total = 0;
  }
  setTotal(total) {
    this.total = total;
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
      document.getElementById(this.appId).addEventListener('click', event => {
        let e = event || window.event,
            elem = e.target || e.srcElement;
        if(elem.tagName.toLowerCase() !== 'button') return false;
        if(elem.hasAttribute('data-download')) {
          elem.classList.toggle(this.loadingClass);
          let loadedItems = [].slice.call(document.getElementById(this.itemsId).children).length;
          if(this.total > loadedItems) {
            setTimeout(() => {
              this.notify('showMore', storageManager.restore());
              elem.classList.toggle(this.loadingClass);
              if(loadedItems + this.perRow >= this.total) elem.setAttribute('disabled', 'disabled');
            }, 500);
          }
        }
        if(elem.hasAttribute('data-delete')) {
          elem.classList.toggle(this.loadingClass);
          setTimeout(() => {
            this.notify('removeElem', elem.getAttribute('data-delete'));
            elem.classList.toggle(this.loadingClass);
            elem.parentNode.parentNode.parentNode.parentNode.removeChild(elem.parentNode.parentNode.parentNode);
            document.getElementById(this.appId).lastElementChild.removeAttribute('disabled');
          }, 500);
        }
      });
  }
}
