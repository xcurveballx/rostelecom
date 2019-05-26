/**
 * ViewManageris responsible for the views and it also detects when the DOM is ready.
 */
import Manager from "./Manager";
import {Promise} from "./config";

export default class ViewManager extends Manager {
  constructor(ObserverList) {
    super(ObserverList);
    this.settings.loadMode = 'afterBegin';
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
    let root = document.getElementById(this.settings.appId),
        view = `<div id="${this.settings.itemsId}">${this.templateItems(data)}</div>
                <button data-download><img src="spinner.gif">download</button>`;
    root.innerHTML = view;
  }
  renderErrorView(error) {
    let root = document.getElementById(this.settings.appId),
        view = `<div class="error">Ups...something went wrong!
                Try to visit this page later.<pre><code><strong>${error.name}</strong>
${error.message}
${error.stack}</code></pre></div>`;
    root.innerHTML = view;
  }
  renderItems(data) {
    let root = document.getElementById(this.settings.itemsId);
    root.insertAdjacentHTML(this.settings.loadMode, this.templateItems(data));
  }
  deleteItem(data) {
    let elem = data.elem;
    elem.classList.toggle(this.settings.loadingClass);
    let item = elem.parentNode.parentNode.parentNode;
    item.parentNode.removeChild(item);
    document.getElementById(this.settings.appId).lastElementChild.removeAttribute('disabled');
  }
  templateItems(data) {
    let items = ``;
    data.forEach(item => {
      items += this.templateItem(item);
    });
    return items;
  }
  templateItem(item) {
    return `<div class="item">
              <img data-image="${item.url}" onload="lazyLoad(this)" src="spinner.gif" class="no-image"/>
              <div class="flex">
                <div class="content front"><span>${item.title}</span></div>
                <div class="content back">
                  <span>${item.title.split(" ")[0]}</span>
                  <span>${item.title}</span>
                  <button data-delete="${item.id}"><img src="spinner.gif">delete</button>
                </div>
              </div>
            </div>`;
  }
}
