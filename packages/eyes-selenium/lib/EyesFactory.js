'use strict';

const { TypeUtils } = require('@applitools/eyes-common');

const { EyesSelenium } = require('./EyesSelenium');
const { EyesVisualGrid } = require('./EyesVisualGrid');

/**
 * @ignore
 */
class EyesFactory {
  // noinspection JSAnnotator
  /**
   * Creates a new (possibly disabled) Eyes instance that interacts with the Eyes Server at the specified url.
   *
   * @param {string|boolean} [serverUrl=EyesBase.getDefaultServerUrl()] - The Eyes server URL or set {@code true} if you want to use VisualGrid service (instead of 3rd argument).
   * @param {boolean} [isDisabled=false] - Set {@code true} to disable Applitools Eyes and use the webdriver directly.
   * @param {boolean} [isVisualGrid=false] - Set {@code true} if you want to use VisualGrid service.
   * @return {Eyes}
   */
  constructor(serverUrl, isDisabled, isVisualGrid) {
    if (TypeUtils.isBoolean(serverUrl)) {
      isVisualGrid = serverUrl;
      serverUrl = undefined;
    }

    if (isVisualGrid === true) {
      return new EyesVisualGrid(serverUrl, isDisabled);
    }

    return new EyesSelenium(serverUrl, isDisabled);
  }
}

exports.EyesFactory = EyesFactory;