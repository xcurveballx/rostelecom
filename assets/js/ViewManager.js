/**
 * ViewManageris responsible for the views and it also detects when the DOM is ready.
 */
import SubjectObserver from "./SubjectObserver";
import {Promise} from "./config";

export default class ViewManager extends SubjectObserver {
  constructor(ObserverList) {
    super(ObserverList);
  }
  ready() {
    return new Promise((resolve, reject) => {
      if(document.readyState === 'interactive' || document.readyState === 'complete') resolve(document.readyState);
      document.onreadystatechange = function() {
        if (~['interactive', 'complete'].indexOf(document.readyState)) {
          resolve(document.readyState);
          document.onreadystatechange = null;
        }
      }
    });
  }
  renderView(data) {
    let root = document.getElementById(this.appId);
    let view = `<div id="${this.itemsId}">${this.templateItems(data)}</div>
                <button data-download><img src="spinner.gif">download</button>`;
    root.innerHTML = view;
  }
  renderErrorView(error) {
    let root = document.getElementById(this.appId);
    let view = `<div class="error">Ups...something went wrong!
                Try to visit this page later.<pre><code><strong>${error.name}</strong>
${error.message}
${error.stack}</code></pre></div>`;
    root.innerHTML = view;
  }
  renderItems(data) {
    let root = document.getElementById(this.itemsId);
    root.insertAdjacentHTML('afterbegin', this.templateItems(data));
  }
  deleteItem(data) {
    let elem = data.elem;
    elem.classList.toggle(this.loadingClass);
    let item = elem.parentNode.parentNode.parentNode;
    item.parentNode.removeChild(item);
    document.getElementById(this.appId).lastElementChild.removeAttribute('disabled');
  }
  templateItems(data) {
    let items = ``;
    data.forEach(item => {
      items += this.templateItem(item);
    });
    return items;
  }
  templateItem(item) {
    this.shown++;
    return `<div class="item">
              <img data-image="${item.imageUrl}" onload="lazyLoad(this)" src="spinner.gif" class="no-image"/>
              <div class="flex">
                <div class="content front"><span>${item.name}</span></div>
                <div class="content back">
                  <span>${item.name}</span>
                  <span>${item.text}</span>
                  <button data-delete="${item.id}"><img src="spinner.gif">delete</button>
                </div>
              </div>
            </div>`;
  }
}
