const puppeteer = require('puppeteer-core');

const URL = process.argv[2] || 'http://127.0.0.1:3000/index.html';
const MOBILE = (process.argv[3] || '').toLowerCase() === 'mobile';
const CHROME = process.env.CHROME_PATH ||
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });
  const page = await browser.newPage();
  const logs = [];
  page.on('console', m => logs.push('[' + m.type() + '] ' + m.text()));
  page.on('pageerror', e => logs.push('[pageerror] ' + e.message));

  if (MOBILE) {
    await page.emulate({
      viewport: { width: 392, height: 800, isMobile: true, deviceScaleFactor: 3, hasTouch: true },
      userAgent: 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Mobile'
    });
  } else {
    await page.setViewport({ width: 1280, height: 800 });
  }

  await page.goto(URL, { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise(r => setTimeout(r, 800));

  const data = await page.evaluate(() => {
    const de = document.documentElement;
    const innerW = window.innerWidth;
    const vv = (window.visualViewport && window.visualViewport.width) || null;
    const all = Array.from(document.querySelectorAll('*'));
    const over = [];
    all.forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.right > innerW + 0.5) {
        over.push({
          tag: el.tagName.toLowerCase(),
          id: el.id || '',
          cls: (typeof el.className === 'string' ? el.className : '') || '',
          right: Math.round(r.right * 100) / 100,
          w: Math.round(r.width * 100) / 100
        });
      }
    });
    over.sort((a, b) => b.right - a.right);
    return {
      title: document.title,
      innerW, visualW: vv,
      docScrollW: de.scrollWidth, bodyScrollW: document.body.scrollWidth,
      overflowCount: over.length,
      topOverflow: over.slice(0, 15)
    };
  });

  console.log('=== BROWSER DIAG ===');
  console.log('URL:', URL, MOBILE ? '(mobile 392x800)' : '(desktop 1280x800)');
  console.log(JSON.stringify(data, null, 2));
  console.log('=== CONSOLE LOGS (' + logs.length + ') ===');
  logs.slice(0, 40).forEach(l => console.log(l));

  await browser.close();
})().catch(e => { console.error('SCRIPT ERROR:', e); process.exit(1); });
