export default class LoadManager {
  constructor(ObserverList) {
    this.observers = ObserverList;
    this.url = 'http://81.177.101.143:30080/test.json';
  }
  // Subject methods
  addObserver(evt, observer, callback) {
    this.observers.add(evt, observer, callback);
  }
  notify(evt, data) {
    this.observers.list[evt].forEach(observer => observer.instance.update(observer.callback, data) );
  }
}
