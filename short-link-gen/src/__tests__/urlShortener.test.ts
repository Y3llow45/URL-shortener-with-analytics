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
    //page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));
    //page.on('request', (request) => console.log('Request:', request.url()));
    //page.on('response', (response) =>
    //  console.log('Response:', response.url(), response.status())
    //);

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
    
    await page.waitForSelector('a#shortUrl', {visible:true, timeout: 5000});

    const shortUrl = await page.evaluate(() => {
      const linkElement = document.getElementById('shortUrl') as HTMLAnchorElement;
      return linkElement?.href || null;
    });
    expect(shortUrl).toBeTruthy();
    console.log('Short URL:', shortUrl);

    await page.goto(`${shortUrl}`);
    await sleep(1000);
    expect(page.url().slice(0, -1)).toBe(longUrl);

    await page.goto('http://localhost:3000/home');
    await sleep(1000);

    const visitorCount = await page.$eval('p#visitorCount', (el:any) => parseInt(el.textContent || '0', 10));
    expect(visitorCount).toBeGreaterThan(0);
  }, 180000);
});
