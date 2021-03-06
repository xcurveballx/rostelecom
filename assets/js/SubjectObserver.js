/**
 * SubjectObserver, adds Subject/Observer functionality to the objects
 * Subjects will emit a message to inform all the dependants that something important occurred;
 * Observers - are those dependants that will react somehow.
 */
export default class SubjectObserver { 
  constructor(ObserverList) {
    this.observers = ObserverList;
  }
  // Subject methods
  addObserver(evt, observer, callback) {
    this.observers.add(evt, observer, callback);
  }
  notify(evt, data) {
    this.observers.list[evt].forEach(observer => observer.instance.update(observer.callback, data) );
  }
  // Observer method
  update(callback, data) {
    callback.call(this, data);
  }
}
