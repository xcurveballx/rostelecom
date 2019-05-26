/**
 * StorageManager manages saving & retrieving data.
 * StorageManager initially always get exactly the same data
 * from the sessionStorage it saved upon getting. Then via functions
 * only chunks passed to the views.
 */
import Manager from "./Manager";

export default class StorageManager extends Manager {
  constructor(ObserverList) {
    super(ObserverList);
    this.data = null;
    this.shownIds = []; // keeps track of what is currently shown
    this.settings.storageName = 'rostelecom';
    this.settings.storageType = 'sessionStorage';
    this.settings.sortProp = 'id';
  }
  // removes an id from the list of the shown ids
  removeItemId(data) {
    if(~this.shownIds.indexOf(data.id)) this.shownIds.splice(this.shownIds.indexOf(data.id), 1);
  }
  isAvailable() {
    try {
      let storage = window[this.settings.storageType], x = '__storage_test__';
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
    } catch(e) { return false; }
  }
  isEmpty() {
    if(!this.isAvailable()) return true;
    if(window[this.settings.storageType].getItem(this.settings.storageName)) return false; else return true;
  }
  save(data) {
    if(!data) return false;
    if(!this.isAvailable()) {
      this.data = data;
      return false;
    }
    try {
      window[this.settings.storageType].setItem(this.settings.storageName, JSON.stringify(data));
      return this.settings.storageName;
    } catch(e) {
      this.data = data;
      return false;
    }
  }
  // due to slice() returns a new array, doesn't change the original one
  sort(items) {
    return items.slice(0).sort((a, b) => {
      return (a[this.settings.sortProp] > b[this.settings.sortProp]) ? 1 : (a[this.settings.sortProp] < b[this.settings.sortProp]) ? -1 : 0;
    });
  }
  paginate(items) {
    let itemsToShow = [], count = 0;
    items.every(item => {
      // stop, if we got 4 items or there are no more items
      if(count === this.settings.perRow || this.shownIds.length === Manager.total) return false;
      if(!~this.shownIds.indexOf(item.id)) {
        itemsToShow.push(item);
        this.shownIds.push(item.id);
        count++;
      }
      return true;
    });
    return itemsToShow;
  }
  // returns already chunked data, not all the data
  restore() {
    let data = this.data ? this.data : JSON.parse(window[this.settings.storageType].getItem(this.settings.storageName));
    Manager.total = data.length;
    return this.paginate(this.sort(data));
  }
}
