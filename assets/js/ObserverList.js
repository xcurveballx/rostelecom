export default class ObserverList {
  constructor() {
    this.list = {};
  }
  // ObserverList, adds and holds observers for the Subject
  add(evt, observer, callback) {
    if(!Array.isArray(this.list[evt])) this.list[evt] = [];
    this.list[evt].push({
      instance: observer,
      callback: callback
    });
  }
}
