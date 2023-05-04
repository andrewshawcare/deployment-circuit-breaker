import * as assert from "assert";
import * as puppeteer from "puppeteer";
import * as waitPort from "wait-port";

(async ({ APPLICATION_HOST = "localhost", APPLICATION_PORT = 8080 }) => {
    const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
    const page = await browser.newPage();

    await waitPort({ host: APPLICATION_HOST, port: APPLICATION_PORT as number });
    await page.goto(`http://${APPLICATION_HOST}:${APPLICATION_PORT}`);
    
    const submitElementSelector = "#submit";
    const submitElement = await page.waitForSelector(submitElementSelector);
    if (!submitElement) {
        assert.fail(`Selector ${submitElementSelector} for submit element was not found.`)
    }
    await submitElement.click();
    
    const imageElement = await page.waitForSelector("#image[data-tag]");
    const imageElementTag = await page.evaluate(imageElement => imageElement.dataset.tag, imageElement);
    assert.deepStrictEqual(imageElementTag, "dog");

    return browser.close();
})(process.env);