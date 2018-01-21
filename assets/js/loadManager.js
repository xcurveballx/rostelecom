/**
 * Parent class for further implementations.
 */
import SubjectObserver from "./SubjectObserver";

export default class LoadManager extends SubjectObserver {
  constructor(ObserverList) {
    super(ObserverList);
    this.url = 'http://81.177.101.143:30080/test.json';
  }
}
