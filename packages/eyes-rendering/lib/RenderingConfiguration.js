'use strict';


const { Configuration } = require('@applitools/eyes-common');

class RenderingConfiguration extends Configuration {
  /**
   * @param {RenderingConfiguration} configuration
   */
  constructor(configuration) {
    super(configuration);
    this._browsersInfo = [];
    this._concurrentSessions = 3;
    this._isThrowExceptionOn = false;

    if (configuration) {
      this._browsersInfo = configuration.getBrowsersInfo();
      this._concurrentSessions = configuration.getConcurrentSessions();
      this._isThrowExceptionOn = configuration.getIsThrowExceptionOn();
    }
  }

  /**
   * @param {{width: number, height: number, name: string}[]} browsersInfo
   */
  setBrowsersInfo(browsersInfo) {
    this._browsersInfo = browsersInfo;
  }

  /**
   * @return {{width: number, height: number, name: string}[]}
   */
  getBrowsersInfo() {
    return this._browsersInfo;
  }

  /**
   * @param {number} width
   * @param {number} height
   * @param {RenderingConfiguration.BrowserType} browserType
   * @return {RenderingConfiguration}
   */
  addBrowser(width, height, browserType) {
    const browserInfo = {
      width, height, name: browserType,
    };
    this._browsersInfo.push(browserInfo);
    return this;
  }

  /**
   * @param {number} concurrentSessions
   */
  setConcurrentSessions(concurrentSessions) {
    this._concurrentSessions = concurrentSessions;
  }

  /**
   * @return {number}
   */
  getConcurrentSessions() {
    return this._concurrentSessions;
  }

  /**
   * @param {boolean} isThrowExceptionOn
   */
  setIsThrowExceptionOn(isThrowExceptionOn) {
    this._isThrowExceptionOn = isThrowExceptionOn;
  }

  /**
   * @return {boolean}
   */
  getIsThrowExceptionOn() {
    return this._isThrowExceptionOn;
  }

  /**
   * @return {RenderingConfiguration}
   */
  cloneConfig() {
    return new RenderingConfiguration(this);
  }
}

/**
 * @readonly
 * @enum {string}
 */
RenderingConfiguration.BrowserType = {
  CHROME: 'chrome',
  FIREFOX: 'firefox',
};

Object.freeze(RenderingConfiguration.BrowserType);
exports.RenderingConfiguration = RenderingConfiguration;