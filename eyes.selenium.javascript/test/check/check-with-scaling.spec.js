const { Builder, By } = require('selenium-webdriver');
const { Options } = require('selenium-webdriver/chrome');
const { ConsoleLogHandler, RectangleSize } = require('eyes.sdk');
const { Eyes, Target } = require('../../index');

let driver = null, eyes = null;
describe('Eyes.Selenium.JavaScript - check-with-scaling', () => {

    before(function () {
        const options = new Options().addArguments("--force-device-scale-factor=1.25");
        // noinspection JSCheckFunctionSignatures
        driver = new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .usingServer('http://localhost:4444/wd/hub')
            .build();

        eyes = new Eyes();
        eyes.setApiKey(process.env.APPLITOOLS_API_KEY);
        eyes.setLogHandler(new ConsoleLogHandler(true));
    });

    it("test check with scaling", function () {
        return eyes.open(driver, this.test.parent.title, this.test.title, new RectangleSize(800, 560)).then(driver => {
            driver.get('https://astappev.github.io/test-html-pages/');

            eyes.check("Entire window", Target.window().fully());

            eyes.check("Text block", Target.region(By.id("overflowing-div")).fully());

            eyes.check("Minions", Target.region(By.id("overflowing-div-image")).fully());

            return eyes.close();
        });
    });

    afterEach(function () {
        return driver.quit().then(() => eyes.abortIfNotClosed());
    });
});