# Jones Automation Exercise

| Part | Content | File |
|------|---------|------|
| A | Playwright automation for https://test.netlify.app/ | [automation.js](automation.js) |
| B | Billing widget review: issues, test cases, product solution | [ANSWERS.md](ANSWERS.md) |

## Part A: Automation flow

1. Opens the landing page.
2. Types values in the Name, Email, Phone, Company and Website fields.
3. Bonus: changes Number of Employees from `1-10` to `51-500`.
4. Saves a full-page screenshot to `screenshots/before-submit.png`.
5. Clicks "Request a call back".
6. Waits for `thank-you.html` and writes a message to the console.

## Requirements

- Node.js 18 or later

## Run

```bash
npm install
npx playwright install chromium
npm start
```

To watch the browser while the flow runs:

```bash
# macOS / Linux
HEADLESS=false npm start
# Windows PowerShell
$env:HEADLESS="false"; npm start
```

## Expected output

```
Opened https://test.netlify.app/
Filled in Name, Email, Phone, Company and Website
Number of Employees changed to: 51-500
Screenshot saved: .../screenshots/before-submit.png
Reached the thank you page: https://test.netlify.app/thank-you.html?...
```
