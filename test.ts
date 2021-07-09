import * as assert from "assert";
import * as puppeteer from "puppeteer";
import * as waitPort from "wait-port";

(async ({ APPLICATION_HOST = "localhost" }) => {
    const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
    const page = await browser.newPage();

    await waitPort({ host: APPLICATION_HOST, port: 80 });
    await page.goto(`http://${APPLICATION_HOST}`);
    
    const submitElement = await page.waitForSelector("#submit");
    await submitElement.click();
    
    const imageElement = await page.waitForSelector("#image[data-tag]");
    const imageElementTag = await page.evaluate(imageElement => imageElement.dataset.tag, imageElement);
    assert.deepStrictEqual(imageElementTag, "dog");

    return browser.close();
})(process.env);