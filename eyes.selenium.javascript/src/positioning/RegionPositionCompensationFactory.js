'use strict';

const {BrowserNames} = require('eyes.sdk');

const FirefoxRegionPositionCompensation = require('./FirefoxRegionPositionCompensation');
const NullRegionPositionCompensation = require('./NullRegionPositionCompensation');
const SafariRegionPositionCompensation = require('./SafariRegionPositionCompensation');

class RegionPositionCompensationFactory {

    /**
     * @param {UserAgent} userAgent
     * @param {Eyes} eyes
     * @param {Logger} logger
     * @return {RegionPositionCompensation}
     */
    static getRegionPositionCompensation(userAgent, eyes, logger) {
        if (userAgent) {
            if (userAgent.getBrowser() === BrowserNames.Firefox) {
                try {
                    if (parseInt(userAgent.getBrowserMajorVersion(), 10) >= 48) {
                        return new FirefoxRegionPositionCompensation(eyes, logger);
                    }
                } catch (err) {
                    return new NullRegionPositionCompensation();
                }
            } else if (userAgent.getBrowser() === BrowserNames.Safari) {
                return new SafariRegionPositionCompensation();
                //regionInScreenshot = regionInScreenshot.offset(0, (int) Math.ceil(pixelRatio));
            }
        }
        return new NullRegionPositionCompensation();
    }
}

module.exports = RegionPositionCompensationFactory;
