# Mochateer

Fanci-fy your mocha tests with puppeteer.

This package launches a puppeteer browser for your mocha tests. This enables simple and convenient end-to-end testing within the mocha framework.

Some additional utility functions have been provided for convenience.

## Usage

```javascript
const mochateer = require('mochateer')({ headless: false, width: 1280, height: 900 });

describe('Mochateer Tests', function() {
  mochateer.it('should open browser', async function(browser, page) {
    await page.goto('https://www.google.com');
    await page.fill('.gsfi', 'test');
    await page.clickByText('input', 'Google Search');
    await page.waitForText('.hdtb-mitem', 'All');

    const pageContent = await page.innerText('#res');

    // your assertions here
  });
})
```

The `browser` and `page` arguments are the puppeteer objects (see the [puppeteer documentation](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md)).

## API

In addition to the standard puppeteer behaviour, the `page` argument also provides the following API:

**page.innerText(selector)**

Returns a promise resolving to the inner text of the specified element.

**page.wait(selector)**

Identical to the puppeteer function, however also prints a nice error message on failure.

**page.waitForText(selector, text)**

Wait for specific text to be displayed in a specified selector.

**page.fill(selector, value[, iframe])**

Fill an input. An optional iframe which contains the input field may be specified.

**page.selectByText(selector, text)**

Select from a dropdown by the visible text.

**page.clickByText(selector, text)**

Click on an element with the specified `selector` and inner text or value of `text`.

## Notes

When using mochateer, you may need to increase the timeout of the mocha runner: `mocha --timeout 20000`
