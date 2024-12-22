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
  });

  afterAll(async () => {
    if (browser) {
      await browser.close();
    }
  });

  const retryClick = async (page: Page, selector: string, retries: number = 3) => {
    for (let i = 0; i < retries; i++) {
      await page.click(selector);
      await sleep(5000);
      const exists = await page.$('a#shortUrl');
      if (exists) return true;
      if (i < retries - 1) {
        await page.reload();
        await sleep(5000);
        await page.type('input[name="url"]', 'https://www.example.com');
        await sleep(5000);
      }
    }
    return false;
  };

  test('Shorten URL and verify redirection and visitor count', async () => {
    await sleep(500);
    const longUrl = 'https://www.example.com';
    await page.goto('http://localhost:3000/home');
    await sleep(500);
    await page.type('input[name="url"]', longUrl);
    await sleep(500);

    const clicked = await retryClick(page, 'button#shorten');
    expect(clicked).toBe(true);
    
    await page.waitForSelector('a#shortUrl', {visible:true, timeout: 5000});

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
