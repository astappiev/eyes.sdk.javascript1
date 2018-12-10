'use strict';
const throatPkg = require('throat');
const createLogger = require('./createLogger');
const makeGetAllResources = require('./getAllResources');
const makeExtractCssResources = require('./extractCssResources');
const makeFetchResource = require('./fetchResource');
const makeExtractCssResourcesFromCdt = require('./extractCssResourcesFromCdt');
const createResourceCache = require('./createResourceCache');
const makeWaitForRenderedStatus = require('./waitForRenderedStatus');
const makeGetRenderStatus = require('./getRenderStatus');
const makePutResources = require('./putResources');
const makeRenderBatch = require('./renderBatch');
const makeOpenEyes = require('./openEyes');
const makeCreateRGridDOMAndGetResourceMapping = require('./createRGridDOMAndGetResourceMapping');
const makeParseInlineCssFromCdt = require('./parseInlineCssFromCdt');
const getBatch = require('./getBatch');
const transactionThroat = require('./transactionThroat');
const getRenderMethods = require('./getRenderMethods');
const {
  authorizationErrMsg,
  blockedAccountErrMsg,
  badRequestErrMsg,
  apiKeyFailMsg,
} = require('./wrapperUtils');

// TODO when supporting only Node version >= 8.6.0 then we can use ...config for all the params that are just passed on to makeOpenEyes
function makeRenderingGridClient({
  renderWrapper, // for tests
  showLogs,
  renderStatusTimeout,
  renderStatusInterval,
  concurrency = Infinity,
  renderConcurrencyFactor = 5,
  appName,
  browser = {width: 1024, height: 768},
  apiKey,
  saveDebugData,
  batchName,
  batchId,
  properties,
  baselineBranchName,
  baselineEnvName,
  baselineName,
  envName,
  ignoreCaret,
  isDisabled,
  matchLevel,
  matchTimeout,
  parentBranchName,
  branchName,
  proxy,
  saveFailedTests,
  saveNewTests,
  compareWithParentBranch,
  ignoreBaseline,
  serverUrl,
  agentId,
}) {
  if (!apiKey) {
    throw new Error(apiKeyFailMsg);
  }
  const openEyesConcurrency = Number(concurrency);

  if (isNaN(openEyesConcurrency)) {
    throw new Error('concurrency is not a number');
  }

  let renderInfoPromise;
  const eyesTransactionThroat = transactionThroat(openEyesConcurrency);
  const renderThroat = throatPkg(openEyesConcurrency * renderConcurrencyFactor);
  const logger = createLogger(showLogs);
  const {
    doGetRenderInfo,
    doRenderBatch,
    doPutResource,
    doGetRenderStatus,
    setRenderingInfo,
  } = getRenderMethods({
    renderWrapper,
    apiKey,
    logger,
    serverUrl,
    proxy,
  });
  const resourceCache = createResourceCache();
  const fetchCache = createResourceCache();
  const extractCssResources = makeExtractCssResources(logger);
  const fetchResource = makeFetchResource({logger, fetchCache});
  const extractCssResourcesFromCdt = makeExtractCssResourcesFromCdt(extractCssResources);
  const putResources = makePutResources({doPutResource});
  const renderBatch = makeRenderBatch({
    putResources,
    resourceCache,
    fetchCache,
    logger,
    doRenderBatch,
  });
  const getRenderStatus = makeGetRenderStatus({
    logger,
    doGetRenderStatus,
    getStatusInterval: renderStatusInterval,
  });
  const waitForRenderedStatus = makeWaitForRenderedStatus({
    timeout: renderStatusTimeout,
    logger,
    getRenderStatus,
  });
  const getAllResources = makeGetAllResources({
    resourceCache,
    extractCssResources,
    fetchResource,
    logger,
  });
  const parseInlineCssFromCdt = makeParseInlineCssFromCdt(extractCssResourcesFromCdt);
  const createRGridDOMAndGetResourceMapping = makeCreateRGridDOMAndGetResourceMapping({
    getAllResources,
    parseInlineCssFromCdt,
  });

  const {batchId: defaultBatchId, batchName: defaultBatchName} = getBatch({batchName, batchId});

  const openEyes = makeOpenEyes({
    appName,
    browser,
    apiKey,
    saveDebugData,
    batchName: defaultBatchName,
    batchId: defaultBatchId,
    properties,
    baselineBranchName,
    baselineEnvName,
    baselineName,
    envName,
    ignoreCaret,
    isDisabled,
    matchLevel,
    matchTimeout,
    parentBranchName,
    branchName,
    proxy,
    saveFailedTests,
    saveNewTests,
    compareWithParentBranch,
    ignoreBaseline,
    serverUrl,
    logger,
    renderBatch,
    waitForRenderedStatus,
    renderThroat,
    getRenderInfoPromise,
    getHandledRenderInfoPromise,
    doGetRenderInfo,
    createRGridDOMAndGetResourceMapping,
    eyesTransactionThroat,
    agentId,
  });

  return {
    openEyes,
  };

  function getRenderInfoPromise() {
    return renderInfoPromise;
  }

  function getHandledRenderInfoPromise(promise) {
    renderInfoPromise = promise
      .then(renderInfo => {
        setRenderingInfo(renderInfo);
        return renderInfo;
      })
      .catch(err => {
        if (err.response) {
          if (err.response.status === 401) {
            return new Error(authorizationErrMsg);
          }
          if (err.response.status === 403) {
            return new Error(blockedAccountErrMsg);
          }
          if (err.response.status === 400) {
            return new Error(badRequestErrMsg);
          }
        }

        return err;
      });

    return renderInfoPromise;
  }
}

module.exports = makeRenderingGridClient;
