const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://test.netlify.app/';
const SCREENSHOT_DIR = path.join(__dirname, 'screenshots');

// Test data (fictional values only)
const formData = {
  name: 'Test User',
  email: 'test.user@example.com',
  phone: '0501234567',
  company: 'Test Company Ltd',
  website: 'https://example.com',
  employees: '51-500',
};

(async () => {
  // Set HEADLESS=false to watch the browser while the flow runs
  const browser = await chromium.launch({ headless: process.env.HEADLESS !== 'false' });
  const page = await browser.newPage();

  try {
    // 1. Open the landing page
    await page.goto(BASE_URL);
    console.log(`Opened ${BASE_URL}`);

    // 2. Type values in the Name, Email, Phone, Company and Website fields
    await page.fill('#name', formData.name);
    await page.fill('#email', formData.email);
    await page.fill('#phone', formData.phone);
    await page.fill('#company', formData.company);
    await page.fill('#website', formData.website);
    console.log('Filled in Name, Email, Phone, Company and Website');

    // 3. Bonus: change the Number of Employees from 1-10 to 51-500
    await page.selectOption('#employees', formData.employees);
    const selected = await page.inputValue('#employees');
    console.log(`Number of Employees changed to: ${selected}`);

    // 4. Take a screenshot before clicking "Request a call back"
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
    const screenshotPath = path.join(SCREENSHOT_DIR, 'before-submit.png');
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`Screenshot saved: ${screenshotPath}`);

    // 5. Click "Request a call back" and wait for the thank-you page
    await Promise.all([
      page.waitForURL('**/thank-you.html**'),
      page.click('button:has-text("Request a call back")'),
    ]);

    // 6. Write to the console when the thank-you page is reached
    console.log(`Reached the thank you page: ${page.url()}`);
  } catch (err) {
    console.error('Automation failed:', err.message);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
})();
