# Jones Automation Exercise

| Part | Content | Location |
|------|---------|----------|
| A | Playwright test for https://test.netlify.app/ | [tests/landing-form.spec.js](tests/landing-form.spec.js) |
| B | Billing widget review: issues, test cases, product solution | [ANSWERS.md](ANSWERS.md) |

## Part A: Test flow

1. Opens the landing page.
2. Types values in the Name, Email, Phone, Company and Website fields, and verifies each value.
3. Bonus: changes Number of Employees from `1-10` to `51-500`, and verifies the change.
4. Saves a full-page screenshot to `screenshots/before-submit.png`.
5. Clicks "Request a call back".
6. Verifies the thank-you page (URL and "Thank You!" heading) and writes a message to the console.

## Project structure

```
pages/
  LandingPage.js         # Page Object: form locators and actions
  ThankYouPage.js        # Page Object: thank-you page locators
tests/
  landing-form.spec.js   # the test
playwright.config.js     # Playwright Test configuration
screenshots/             # screenshot taken before submitting
```

Design notes:
- **Page Object Model:** locators and page actions live in `pages/`, so the test reads as a sequence of user steps.
- **User-facing locators:** fields are located by their labels (`getByLabel`) and the button by its role and name (`getByRole`), as Playwright recommends. These keep working when IDs or CSS classes change.
- **Assertions:** every step is verified with `expect`, so the test fails clearly when the page behaves unexpectedly.

## Requirements

- Node.js 18 or later (check with `node -v`)

## Run

```bash
npm install
npx playwright install chromium   # one-time browser download
npm test                          # or: npx playwright test
```

Other commands:

```bash
npm run test:headed   # run with a visible browser
npm run report        # open the HTML report of the last run
```

## Expected output

```
Running 1 test using 1 worker

Screenshot saved: .../screenshots/before-submit.png
Reached the thank you page: https://test.netlify.app/thank-you.html?...
  ok 1 [chromium] › tests/landing-form.spec.js › Landing page - Request a call back form › submits the form and reaches the thank you page

  1 passed
```
