const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  console.log('Launching browser...');
  const browser = await chromium.launch({
    headless: true
  });
  
  const page = await browser.newPage();
  
  // Set viewport to a standard desktop size
  await page.setViewportSize({ width: 1920, height: 1080 });
  
  console.log('Navigating to http://localhost:5001/logistics-landing...');
  await page.goto('http://localhost:5001/logistics-landing', {
    waitUntil: 'networkidle',
    timeout: 30000
  });
  
  console.log('Page loaded successfully!');
  
  // Wait a bit for any animations or lazy loading
  await page.waitForTimeout(2000);
  
  // Create screenshots directory if it doesn't exist
  const screenshotsDir = path.join(__dirname, '../public/screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }
  
  // 1. Capture header + hero section (top of page)
  console.log('Capturing screenshot 1: Header + Hero section...');
  await page.screenshot({
    path: path.join(screenshotsDir, '01-header-hero.png'),
    fullPage: false
  });
  
  // 2. Scroll to services section
  console.log('Scrolling to services section...');
  await page.evaluate(() => window.scrollBy(0, 800));
  await page.waitForTimeout(500);
  console.log('Capturing screenshot 2: Services section...');
  await page.screenshot({
    path: path.join(screenshotsDir, '02-services.png'),
    fullPage: false
  });
  
  // 3. Scroll to stats section
  console.log('Scrolling to stats section...');
  await page.evaluate(() => window.scrollBy(0, 800));
  await page.waitForTimeout(500);
  console.log('Capturing screenshot 3: Stats section...');
  await page.screenshot({
    path: path.join(screenshotsDir, '03-stats.png'),
    fullPage: false
  });
  
  // 4. Scroll to marquee section
  console.log('Scrolling to marquee section...');
  await page.evaluate(() => window.scrollBy(0, 800));
  await page.waitForTimeout(500);
  console.log('Capturing screenshot 4: Marquee section...');
  await page.screenshot({
    path: path.join(screenshotsDir, '04-marquee.png'),
    fullPage: false
  });
  
  // 5. Scroll to how we work section
  console.log('Scrolling to how we work section...');
  await page.evaluate(() => window.scrollBy(0, 800));
  await page.waitForTimeout(500);
  console.log('Capturing screenshot 5: How We Work section...');
  await page.screenshot({
    path: path.join(screenshotsDir, '05-how-we-work.png'),
    fullPage: false
  });
  
  // 6. Scroll to app download section
  console.log('Scrolling to app download section...');
  await page.evaluate(() => window.scrollBy(0, 800));
  await page.waitForTimeout(500);
  console.log('Capturing screenshot 6: App Download section...');
  await page.screenshot({
    path: path.join(screenshotsDir, '06-app-download.png'),
    fullPage: false
  });
  
  // 7. Scroll to latest news section
  console.log('Scrolling to latest news section...');
  await page.evaluate(() => window.scrollBy(0, 800));
  await page.waitForTimeout(500);
  console.log('Capturing screenshot 7: Latest News section...');
  await page.screenshot({
    path: path.join(screenshotsDir, '07-latest-news.png'),
    fullPage: false
  });
  
  // 8. Scroll to testimonials section
  console.log('Scrolling to testimonials section...');
  await page.evaluate(() => window.scrollBy(0, 800));
  await page.waitForTimeout(500);
  console.log('Capturing screenshot 8: Testimonials section...');
  await page.screenshot({
    path: path.join(screenshotsDir, '08-testimonials.png'),
    fullPage: false
  });
  
  // 9. Scroll to footer section
  console.log('Scrolling to footer section...');
  await page.evaluate(() => window.scrollBy(0, 800));
  await page.waitForTimeout(500);
  console.log('Capturing screenshot 9: Footer section...');
  await page.screenshot({
    path: path.join(screenshotsDir, '09-footer.png'),
    fullPage: false
  });
  
  // Also capture full page screenshot
  console.log('Capturing full page screenshot...');
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  await page.screenshot({
    path: path.join(screenshotsDir, '00-full-page.png'),
    fullPage: true
  });
  
  console.log('All screenshots captured successfully!');
  console.log(`Screenshots saved to: ${screenshotsDir}`);
  
  await browser.close();
})();
