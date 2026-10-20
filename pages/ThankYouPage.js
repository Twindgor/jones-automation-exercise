// Page Object for the thank-you page shown after the form is submitted
class ThankYouPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.urlPattern = /\/thank-you\.html/;
    this.heading = page.getByRole('heading', { name: 'Thank You!' });
  }
}

module.exports = { ThankYouPage };
