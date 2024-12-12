import puppeteer from 'puppeteer';

describe('URL Shortener Integration Test', () => {
  let browser: puppeteer.Browser;
  let page: puppeteer.Page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  test('Shorten URL and verify redirection and visitor count', async () => {
    const longUrl = 'https://www.example.com';
    
    
    await page.goto('http://localhost:3000');

    
    await page.type('input[name="url"]', longUrl);
    await page.click('button#shorten');

    
    await page.waitForSelector('a#shortUrl');
    const shortUrl = await page.$eval('a#shortUrl', (el:any) => el.getAttribute('href'));

    expect(shortUrl).toBeTruthy();

    
    await page.goto(`http://localhost:3000${shortUrl}`);
    await page.waitForTimeout(1000);
    expect(page.url()).toBe(longUrl);

    
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(1000);

    const visitorCount = await page.$eval('span#visitorCount', (el:any) => parseInt(el.textContent || '0', 10));
    expect(visitorCount).toBeGreaterThan(0);
  });
});
