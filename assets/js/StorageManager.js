/**
 * StorageManager manages saving & retrieving data.
 * StorageManager initially always get exactly the same data
 * from the sessionStorage it saved upon getting. Then via functions
 * only chunks passed to the views.
 */
import SubjectObserver from "./SubjectObserver";

export default class StorageManager extends SubjectObserver {
  constructor(ObserverList) {
    super(ObserverList);
    this.name = 'rostelecom';
    this.data = null;
    this.type = 'sessionStorage';
    this.sortProp = 'age';
    this.shownIds = []; // keeps track of what is currently shown
  }
  totalNum() {
    if(this.data) return this.total = this.data.length;
    return this.total = JSON.parse(window[this.type].getItem(this.name)).length;
  }
  removeItemId(data) { // removes an id from the list of the shown ids
    if(~this.shownIds.indexOf(data.id)) this.shownIds.splice(this.shownIds.indexOf(data.id), 1);
  }
  isAvailable() {
    try {
      let storage = window[this.type], x = '__storage_test__';
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
    } catch(e) { return false; }
  }
  isEmpty() {
    if(!this.isAvailable()) return true;
    if(window[this.type].getItem(this.name)) return false; else return true;
  }
  save(data) {
    if(!data) return false;
    if(!this.isAvailable()) {
      this.data = data;
      return false;
    }
    try {
      window[this.type].setItem(this.name, JSON.stringify(data));
      return this.name;
    } catch(e) {
      this.data = data;
      return false;
    }
  }
  sort(items) { // due to slice() returns a new array, doesn't change the original one
    return items.slice(0).sort((a, b) => {
      return (a[this.sortProp] > b[this.sortProp]) ? 1 : (a[this.sortProp] < b[this.sortProp]) ? -1 : 0;
    });
  }
  paginate(items) {
    let itemsToShow = [], count = 0;
    items.every(item => { // stop, if we got 4 items or there are no more items
      if(count === this.perRow || this.shownIds.length === this.totalNum()) return false;
      if(!~this.shownIds.indexOf(item.id)) {
        itemsToShow.push(item);
        this.shownIds.push(item.id);
        count++;
      }
      return true;
    });
    return itemsToShow;
  }
  restore() { // returns already chunked data, not all the data
    if(this.data) return this.paginate(this.sort(this.data));
    return this.paginate(this.sort(JSON.parse(window[this.type].getItem(this.name))));
  }
}
