import puppeteer, { Browser, Page } from 'puppeteer';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

describe('URL Shortener Integration Test', () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    page = await browser.newPage();
    page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));
    page.on('request', (request) => console.log('Request:', request.url()));
    page.on('response', (response) =>
      console.log('Response:', response.url(), response.status())
    );

  });

  afterAll(async () => {
    await page.screenshot({ path: 'error_screenshot.png' });
    await browser.close();
  });

  test('Shorten URL and verify redirection and visitor count', async () => {
    const longUrl = 'https://www.example.com';
    await page.goto('http://localhost:3000/home');
    await page.type('input[name="url"]', longUrl);
    await page.click('button#shorten');

    const elementExists = await page.$('a#shortUrl');
    console.log('Short URL element exists:', !!elementExists);
    if (!elementExists) {
      throw new Error('Short URL element did not appear on the page');
    }

    const shortUrl = await page.$eval('a#shortUrl', (el:any) => el.getAttribute('href'));
    expect(shortUrl).toBeTruthy();

    await page.goto(`http://localhost:3000${shortUrl}`);
    await sleep(1000);
    expect(page.url()).toBe(longUrl);

    await page.goto('http://localhost:3000/home');
    await sleep(1000);

    const visitorCount = await page.$eval('span#visitorCount', (el:any) => parseInt(el.textContent || '0', 10));
    expect(visitorCount).toBeGreaterThan(0);
  }, 180000);
});
