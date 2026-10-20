// @ts-check
const path = require('path');
const { test, expect } = require('@playwright/test');
const { LandingPage } = require('../pages/LandingPage');
const { ThankYouPage } = require('../pages/ThankYouPage');

// Test data (fictional values only)
const formData = {
  name: 'Test User',
  email: 'test.user@example.com',
  phone: '0501234567',
  company: 'Test Company Ltd',
  website: 'https://example.com',
};

const SCREENSHOT_PATH = path.join(__dirname, '..', 'screenshots', 'before-submit.png');

test.describe('Landing page - Request a call back form', () => {
  test('submits the form and reaches the thank you page', async ({ page }) => {
    const landingPage = new LandingPage(page);
    const thankYouPage = new ThankYouPage(page);

    await test.step('Open the landing page', async () => {
      await landingPage.open();
      await expect(landingPage.submitButton).toBeVisible();
    });

    await test.step('Type values in Name, Email, Phone, Company and Website', async () => {
      await landingPage.fillContactDetails(formData);

      await expect(landingPage.nameInput).toHaveValue(formData.name);
      await expect(landingPage.emailInput).toHaveValue(formData.email);
      await expect(landingPage.phoneInput).toHaveValue(formData.phone);
      await expect(landingPage.companyInput).toHaveValue(formData.company);
      await expect(landingPage.websiteInput).toHaveValue(formData.website);
    });

    await test.step('Bonus: change Number of Employees from 1-10 to 51-500', async () => {
      await expect(landingPage.employeesSelect).toHaveValue('1-10');
      await landingPage.selectNumberOfEmployees('51-500');
      await expect(landingPage.employeesSelect).toHaveValue('51-500');
    });

    await test.step('Take a screenshot before clicking "Request a call back"', async () => {
      await landingPage.takeScreenshot(SCREENSHOT_PATH);
      console.log(`Screenshot saved: ${SCREENSHOT_PATH}`);
    });

    await test.step('Click "Request a call back"', async () => {
      await landingPage.submit();
    });

    await test.step('Verify the thank you page and write to the console', async () => {
      await expect(page).toHaveURL(thankYouPage.urlPattern);
      await expect(thankYouPage.heading).toBeVisible();
      console.log(`Reached the thank you page: ${page.url()}`);
    });
  });
});
