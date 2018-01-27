/**
 * Parent class for further implementations.
 */
import Manager from "./Manager";

export default class LoadManager extends Manager {
  constructor(ObserverList) {
    super(ObserverList);
    this.settings.url = 'http://81.177.101.143:30080/test.json';
  }
}
