'use strict';
const {describe, it} = require('mocha');
const {expect} = require('chai');
const getSha256Hash = require('../../util/getSha256Hash');
const createRenderRequests = require('../../../src/sdk/createRenderRequests');

describe('createRenderRequests', () => {
  it('works', () => {
    const r1 = {getUrl: () => 'url1', getHashAsObject: () => 'hash1'};
    const r2 = {getUrl: () => 'url2', getHashAsObject: () => 'hash2'};
    const url = 'url';
    const cdt = 'cdt';
    const resources = [r1, r2];
    const browsers = [{width: 1, height: 2, name: 'b1'}, {width: 3, height: 4, name: 'b2'}];
    const sizeMode = 'sizeMode';
    const selector = 'selector';
    const region = {left: 1, top: 2, width: 3, height: 4};
    const scriptHooks = 'scriptHooks';
    const renderInfo = {getResultsUrl: () => 'resultsUrl'};
    const renderRequests = createRenderRequests({
      url,
      resources,
      cdt,
      browsers,
      renderInfo,
      sizeMode,
      selector,
      region,
      scriptHooks,
    });

    const resourcesObj = {url1: 'hash1', url2: 'hash2'};
    const dom = {
      hash: getSha256Hash(JSON.stringify({resources: resourcesObj, domNodes: 'cdt'})),
      hashFormat: 'sha256',
    };

    expect(renderRequests.map(r => r.toJSON())).to.eql([
      {
        webhook: 'resultsUrl',
        url,
        dom,
        resources: resourcesObj,
        browser: {name: 'b1', platform: 'Linux'},
        scriptHooks,
        renderInfo: {
          width: 1,
          height: 2,
          selector,
          sizeMode,
          region: {x: 1, y: 2, width: 3, height: 4, coordinatesType: 'SCREENSHOT_AS_IS'},
        },
      },
      {
        webhook: 'resultsUrl',
        url,
        dom,
        resources: resourcesObj,
        browser: {name: 'b2', platform: 'Linux'},
        scriptHooks,
        renderInfo: {
          width: 3,
          height: 4,
          selector,
          sizeMode,
          region: {x: 1, y: 2, width: 3, height: 4, coordinatesType: 'SCREENSHOT_AS_IS'},
        },
      },
    ]);
  });

  it('handles emulation info with deviceName', () => {
    const url = 'url';
    const cdt = 'cdt';
    const resources = [];
    const deviceName = 'deviceName';
    const screenOrientation = 'screenOrientation';
    const browsers = [{deviceName, screenOrientation}];
    const renderInfo = {getResultsUrl: () => 'resultsUrl'};
    const renderRequests = createRenderRequests({
      url,
      resources,
      cdt,
      browsers,
      renderInfo,
    });

    const dom = {
      hash: getSha256Hash(JSON.stringify({resources: {}, domNodes: 'cdt'})),
      hashFormat: 'sha256',
    };

    expect(renderRequests.map(r => r.toJSON())).to.eql([
      {
        webhook: 'resultsUrl',
        url,
        dom,
        resources: {},
        renderInfo: {
          emulationInfo: {deviceName, screenOrientation},
          height: undefined,
          width: undefined,
          selector: undefined,
          region: undefined,
          sizeMode: undefined,
        },
      },
    ]);
  });

  it('handles emulation info with device', () => {
    const url = 'url';
    const cdt = 'cdt';
    const resources = [];
    const browsers = [{width: 1, height: 2, deviceScaleFactor: 3}];
    const renderInfo = {getResultsUrl: () => 'resultsUrl'};
    const renderRequests = createRenderRequests({
      url,
      resources,
      cdt,
      browsers,
      renderInfo,
    });

    const dom = {
      hash: getSha256Hash(JSON.stringify({resources: {}, domNodes: 'cdt'})),
      hashFormat: 'sha256',
    };

    expect(renderRequests.map(r => r.toJSON())).to.eql([
      {
        webhook: 'resultsUrl',
        url,
        dom,
        resources: {},
        renderInfo: {
          emulationInfo: {
            width: 1,
            height: 2,
            deviceScaleFactor: 3,
            screenOrientation: undefined,
            mobile: undefined,
          },
          height: 2,
          width: 1,
          selector: undefined,
          region: undefined,
          sizeMode: undefined,
        },
      },
    ]);
  });
});
