const puppeteer = require('puppeteer');

process.on('unhandledRejection', reason => {throw reason});

let browser = null;
let page = null;

const PageUtils = {
    innerText: async function(selector) {
        await page.wait(selector);
        const innerText = await page.evaluate(query => document.body.querySelector(query).innerText, selector);
        return innerText ? innerText.trim() : innerText;
    },

    wait: async function(selector) {
        try {
            await page.waitForSelector(selector);
        } catch(error) {
            throw new Error(`Waiting for '${selector}' failed`);
        }
    },

    waitForText: async function(selector, text) {
        await page.waitForFunction((selector, text) => {
            const elements = document.querySelectorAll(selector);
            for(let i = 0; i < elements.length; i++) {
                if(elements[i].innerText === text) {
                  return true;
                }
            }
            return false;
        }, {}, selector, text);
    },

    fill: async function(selector, value, iframe) {
        try {
            if(iframe) {
                const frames = await page.frames();
                let iframe = frames.find(f => f.name().startsWith(iframe));
                const textInput = await iframe.$(selector);
                await textInput.type(value);
            } else {
                await page.waitForSelector(selector);
                await page.focus(selector);
                await page.type(selector, value);
            }
        } catch(error) {
            console.error(error);
            throw new Error(`Filling input '${selector}' with value '${value}' failed`);
        }
    },

    selectByText: async function(selector, text) {
        const code = await page.evaluate((selector, text) => {
            const options = document.querySelector(selector).options;
            let foundCode = null;
            for(let i = 0; i < options.length; i++) {
                if(options[i].text === text) {
                    return options[i].value;
                }
            }
            return null;
        }, selector, text);

        assert.isNotNull(code, `Could not find the option '${value}' in the '${selector}' select`);

        page.select(selector, code);
    },

    clickByText: async function(selector, text) {
      const found = await page.$$eval(selector, (elements, text) => {
        for(let i = 0; i < elements.length; i++) {
          if(elements[i].innerText.includes(text) || elements[i].value.includes(text)) {
            elements[i].click();
            return true;
          }
        }
        return false;
      }, text);

      if(!found) throw new Error(`Could not find the element '${selector}' with the text '${text}'`);
    }
};

module.exports = function(config) {
    beforeEach(async function() {
        browser = await puppeteer.launch(Object.assign({}, { headless: false, ignoreHTTPSErrors: true }, config));
        page = await browser.newPage();
        await page.setViewport(Object.assign({}, {width: 900, height: 1080}, config));

        Object.keys(PageUtils).forEach(key => {
            page[key] = PageUtils[key];
        });
    });

    afterEach(async function() {
        await browser.close();
    });

    return {
      it: (name, fn) => {
        const wrappedFn = async () => await fn(browser, page)
        it(name, wrappedFn);
      }
    };
}
