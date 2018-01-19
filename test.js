const mochateer = require('./index')({ headless: false, width: 1280, height: 900 });

describe('Mochateer Tests', function() {
  mochateer.it('should open browser', async function(browser, page) {
    await page.goto('https://www.google.com');
    await page.fill('.gsfi', 'test');
    await page.clickByText('input', 'Google Search');
    await page.waitForText('.hdtb-mitem', 'All');

    console.log(await page.innerText('#res'));
  });
})
