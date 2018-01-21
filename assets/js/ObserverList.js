/**
 * ObserverList, adds and holds observers for the Subjects.
 * Observers - objects that depend somehow on the object they observe.
 */
export default class ObserverList {
  constructor() {
    this.list = {};
  }
  add(evt, observer, callback) {
    if(!Array.isArray(this.list[evt])) this.list[evt] = [];
    this.list[evt].push({
      instance: observer,
      callback: callback
    });
  }
}
