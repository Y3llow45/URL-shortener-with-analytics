import puppeteer, { Browser, Page } from 'puppeteer';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

describe('URL Shortener Integration Test', () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    await sleep(2000);
    try {
      browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
      await sleep(5000);
      page = await browser.newPage();
    } catch (error) {
      console.error('Error during setup:', error);
    }
  });

  afterAll(async () => {
    if (page) {
      await page.screenshot({ path: 'error_screenshot.png' });
    }
    if (browser) {
      await browser.close();
    }
  });

  test('Shorten URL and verify redirection and visitor count', async () => {
    const longUrl = 'https://www.example.com';
    await page.goto('http://localhost:3000/home');
    await page.type('input[name="url"]', longUrl);
    await page.click('button#shorten');
    
    await page.waitForSelector('a#shortUrl', {visible:true, timeout: 50000});

    const shortUrl = await page.evaluate(() => {
      const linkElement = document.getElementById('shortUrl') as HTMLAnchorElement;
      return linkElement?.href || null;
    });
    expect(shortUrl).toBeTruthy();
    await sleep(5000);

    const newPage = await browser.newPage();
    await newPage.goto(`${shortUrl}`);
    expect(newPage.url().slice(0, -1)).toBe(longUrl);
    await sleep(5000);
    await newPage.close();

    await page.click('button#updateVisitsCount');
    await sleep(2000);

    const visitorCount = await page.$eval('p#visitorCount', (el:any) => parseInt(el.textContent || '0', 10));
    expect(visitorCount).toBeGreaterThan(0);
  }, 360000);
});
