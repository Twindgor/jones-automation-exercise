// Page Object for the landing page contact form (https://test.netlify.app/)
class LandingPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.nameInput = page.getByLabel('Name');
    this.emailInput = page.getByLabel('Email');
    this.phoneInput = page.getByLabel('Phone');
    this.companyInput = page.getByLabel('Company');
    this.websiteInput = page.getByLabel('Website');
    this.employeesSelect = page.getByLabel('Number of Employees');
    this.submitButton = page.getByRole('button', { name: 'Request a call back' });
  }

  async open() {
    await this.page.goto('/');
  }

  /** Types values in the Name, Email, Phone, Company and Website fields. */
  async fillContactDetails({ name, email, phone, company, website }) {
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.phoneInput.fill(phone);
    await this.companyInput.fill(company);
    await this.websiteInput.fill(website);
  }

  async selectNumberOfEmployees(range) {
    await this.employeesSelect.selectOption(range);
  }

  async takeScreenshot(path) {
    await this.page.screenshot({ path, fullPage: true });
  }

  async submit() {
    await this.submitButton.click();
  }
}

module.exports = { LandingPage };
