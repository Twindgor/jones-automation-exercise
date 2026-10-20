# Part B: Billing Widget Review

The screen under review is the "Account Information" billing widget used by a global SaaS company. It is a static mock-up, so this review is a design review (static testing): it covers what is visible on the screen, what is missing from it, and what would go wrong if the screen were built exactly as shown.

**Assumptions**
- The widget is used by customers in many countries, as the company is global.
- The amount "30.00" is the charge for a subscription or an invoice.
- Behaviour that is not visible (masking, validation, error messages) is treated as a risk to verify, not as a confirmed defect.

---

## a. Problems found

Severity scale: **Critical** (blocks payment or creates financial or security exposure), **High** (major functional or business impact), **Medium** (degraded experience or likely user error), **Low** (cosmetic or minor).

### Security

| # | Issue | Severity | Impact | Recommendation |
|---|-------|----------|--------|----------------|
| S1 | **No CVV/CVC (security code) field.** | Critical | Card-not-present payments without a CVV face higher fraud and chargeback rates. Many issuers decline them, and acquirers may apply higher fees. | Add a required CVV field: 3 digits, or 4 for American Express. Never store it after authorization (PCI DSS). |
| S2 | Card data appears to be collected in plain form fields on the merchant page, with no trust or security indicators (secure badge, lock icon, PCI or provider notice). | High | It widens the PCI DSS scope of the company. Users may also hesitate to enter card details, which lowers conversion. | Use the payment provider's hosted, tokenized fields (iframe). Show a short "Secure payment" notice. |
| S3 | The design gives no sign of masking for the card number, or of `autocomplete` attributes. | High | The full card number could be visible on screen (shoulder surfing) or kept in browser history or caches. | Mask all but the last 4 digits after entry. Use `autocomplete="cc-number"` and similar attributes, and serve the page over HTTPS only. |
| S4 | There is no protection against submitting twice (no loading or disabled state for **Continue**). | High | A double click or a slow network can cause **duplicate charges**. | Disable the button on submit and show a progress state. Use an idempotency key on the payment request. |
| S5 | There is no sign of strong customer authentication (3-D Secure). | Medium | In regions that require SCA (EU/EEA, UK), payments can be declined. | Support 3-D Secure 2 through the payment provider. |

### Functional and business logic

| # | Issue | Severity | Impact | Recommendation |
|---|-------|----------|--------|----------------|
| F1 | **No Country field**, although the company is global. | High | Billing address checks (AVS), tax calculation and address validation cannot work correctly for customers outside one country. | Add a Country field first, and adapt the address fields to the selected country. |
| F2 | "State or Province" is **required** and shown as one list. | High | Many countries have no states or provinces, so these customers cannot complete the form. A single global list would hold thousands of entries. | Show the field only for countries that use it, with a list filtered by country. |
| F3 | "Postal Code (no dashes)" is **required**, and the rule assumes a numeric format. | High | Some countries have no postal codes. Others use letters and spaces (for example, UK and Canadian formats). These customers are blocked or forced to enter false data. | Use country-specific validation. Make the field optional where postal codes do not exist. |
| F4 | **Payment Amount "30.00" shows no currency.** | High | A global customer cannot tell whether the charge is in USD, EUR or another currency. This leads to disputes and chargebacks. | Show the currency code and symbol, for example "USD 30.00". Consider local currency display. |
| F5 | **Card Type is selected manually**, even though the card number identifies it (BIN/IIN). | Medium | A user can select VISA and enter a Mastercard number, and that mismatch causes errors. It is also an extra, unnecessary step. | Detect the card type automatically from the first digits and show the card logo. Remove the dropdown. |
| F6 | **Expiration** has a single asterisk after Year only. | Medium | It is unclear whether Month is required. Nothing indicates validation against past dates. | Mark both fields as required, or the group as a whole. Reject expired dates. Consider an MM/YY field. |
| F7 | The cardholder name is split into **First Name, MI and Last Name**. | Medium | Many names do not follow this pattern (single names, several surnames, no middle initial). The name printed on the card may also differ from this split. | Use a single "Name on card" field. |
| F8 | The screen shows no validation or error messages. | Medium | Users do not know what went wrong or how to fix it. | Add inline, field-level validation with clear messages. Keep the entered data after an error. |
| F9 | The page title is "Account Information", but the content is payment details. | Low | It is confusing, because users may expect profile or account settings. | Rename it to "Payment Details" or "Billing Information". |
| F10 | There is no order summary (plan, tax, billing period), and no terms or recurring-charge consent. | Medium | For a subscription, users do not know what they pay for or how often. Some regions legally require this consent. | Add a short summary and a consent checkbox or text for recurring charges. |

### Usability and accessibility

| # | Issue | Severity | Impact | Recommendation |
|---|-------|----------|--------|----------------|
| U1 | "No dashes or spaces" moves formatting work to the user. | Medium | It causes avoidable input errors and frustration. | Accept any format and remove spaces and dashes automatically. Format the number in groups of four for readability. |
| U2 | **Continue** and **Cancel** sit side by side and look alike in size. | Medium | An accidental click on Cancel may discard all entered data. | Separate the two buttons visually, style Cancel as a secondary link, and ask for confirmation if data was entered. |
| U3 | Required fields are indicated by a small red asterisk outside the field. | Low | Users with colour blindness or screen readers may miss it. | Add "(required)" to the label, or mark optional fields instead, and use `aria-required`. |
| U4 | The second address line has no label (for example, "Apartment, suite, etc. (optional)"). | Low | Its purpose is unclear, and screen readers cannot announce it. | Add a visible label or a placeholder hint. |
| U5 | The two-column layout (Card Number on the left, Expiration on the right) suggests an unclear tab order. | Low | Keyboard users may jump between columns in an unexpected order. | Use a single-column layout in a logical order: card number, expiry, CVV, name, address. |
| U6 | The field sizes do not match the data. MI is very small, and Card Number is narrow for 16–19 digits. | Low | Entered data may be cut off, so users cannot check their input. | Size each field to its expected content. |
| U7 | The background pattern behind the form lowers contrast. | Low | Readability suffers, especially on mobile devices and for low-vision users. | Use a plain, high-contrast background (WCAG AA). |
| U8 | The design shows no mobile or responsive layout. | Medium | A two-column form with small fields is hard to use on phones. | Use a responsive single-column layout with numeric keyboards for number fields (`inputmode="numeric"`). |

### Performance

| # | Issue | Severity | Impact | Recommendation |
|---|-------|----------|--------|----------------|
| P1 | A single global "State or Province" dropdown would hold thousands of options. | Medium | Rendering is slow, especially on mobile devices, and the list is hard to scroll. | Load the options for the selected country only. |
| P2 | The design shows no loading state for the payment call. | Medium | During a slow payment provider response, users click again (see S4) or leave the page. | Show a spinner or progress message, and set timeouts with clear retry guidance. |
| P3 | The decorative background image adds page weight. | Low | It loads more slowly on slow connections, for no functional benefit. | Remove the image, or compress and lazy-load it. |

---

## b. Sample test cases

### TC-01: Successful payment with a valid card (happy path)

| Field | Details |
|-------|---------|
| **Preconditions** | The user is on the billing widget. The payment provider is in test mode. |
| **Test data** | Card number `4111111111111111` (standard Visa test card), expiry 12 / (current year + 2), CVV `123`, name "Test User", a valid billing address. |
| **Steps** | 1. Select Card Type "VISA". 2. Enter the card number. 3. Select the expiry month and year. 4. Enter First Name and Last Name. 5. Enter the street address, city, state and postal code. 6. Click **Continue**. |
| **Expected result** | The payment is authorized for exactly **30.00** in the displayed currency. A confirmation is shown. Exactly one transaction exists in the payment provider. The card number is masked on screen (`**** **** **** 1111`), and the full card number is not stored or logged by the application. |

### TC-02: Card number validation (negative cases)

| Field | Details |
|-------|---------|
| **Preconditions** | The user is on the billing widget. All other fields contain valid data. |
| **Steps** | Enter each value below in Card Number and click **Continue**. |
| **Expected result** | The form is **not** submitted, and a clear inline error appears on the Card Number field. All other entered data is kept. |

| Input | Reason | Expected |
|-------|--------|----------|
| *(empty)* | Required field | "Card number is required" |
| `4111111111111112` | Fails the Luhn checksum | "Card number is invalid" |
| `41111111` | Too short | "Card number is invalid" |
| `4111abcd11111111` | Contains letters | Letters are blocked or rejected |
| `5555555555554444` with Card Type = VISA | Mastercard number with VISA selected | Mismatch error, or the card type is auto-corrected |
| `4111 1111 1111 1111` | Contains spaces | **Accepted.** Spaces are removed automatically (usability expectation). |

### TC-03: Expiration date validation

| Field | Details |
|-------|---------|
| **Preconditions** | The user is on the billing widget. All other fields contain valid data. |
| **Steps** | Select each combination below and click **Continue**. |

| Month / Year | Expected |
|--------------|----------|
| Not selected / Not selected | Error: "Expiration date is required" |
| Selected / Not selected (and the reverse) | Error on the missing part. Both parts are required. |
| Previous month / Current year | Error: "Card has expired" |
| Current month / Current year | **Accepted.** A card is valid until the end of its expiry month. |
| Any month / Current year + 1 | Accepted |

**Additional test ideas (not detailed):**
- Double-click **Continue**: only one charge is made.
- Cancel after entering data: a confirmation appears, and no charge is made.
- Keyboard-only navigation and screen reader labels.
- A non-US address with no state or postal code.
- A session timeout during entry.
- The layout at mobile widths.

---

## c. Product solution for the most severe issue

**Most severe issue: S1, the missing CVV (security code) field**, together with raw card fields collected directly on the page (S2).

**Why it is the most severe:**
- **Fraud and chargebacks.** The CVV proves that the payer holds the physical card. Without it, a stolen card number alone is enough to pay, and the company carries the chargeback costs.
- **Lower approval rates.** Many issuers decline card-not-present transactions that do not include a CVV, so legitimate customers fail to pay, and revenue is lost.
- **Higher fees and compliance risk.** Acquirers may charge more for transactions without a CVV. Collecting raw card data on the merchant's own page also increases the PCI DSS compliance scope.

**Proposed solution:**
1. **Replace the raw card inputs with the payment provider's hosted, tokenized card fields** (secure iframes). The provider collects the card number, expiry and CVV, and the company receives only a token. This takes card data off the company's servers and reduces PCI scope to the lowest level.
2. **Add a required CVV field**:
   - 3 digits, or 4 for American Express, adjusted automatically by card type.
   - Masked input, with a "What is this?" tooltip showing where the code is printed on the card.
   - Never stored after authorization, as PCI DSS requires.
3. **Detect the card type automatically** from the card number, and remove the Card Type dropdown (this also fixes F5).
4. **Enable 3-D Secure 2** for regions that require strong customer authentication (S5).
5. **Prevent duplicate charges**: disable **Continue** on submit, and send an idempotency key with each payment request (this also fixes S4).

**Acceptance criteria:**
- A payment cannot be submitted without a valid CVV of the correct length for the card type.
- The CVV never appears in application logs, databases or analytics events.
- The application backend receives only a payment token, never the raw card number or CVV.
- The card type is detected correctly for Visa, Mastercard, American Express and the other supported networks.
- A double click on **Continue** results in exactly one charge.

**Success metrics:** fewer fraud chargebacks, a higher authorization approval rate and a lower PCI compliance effort.
