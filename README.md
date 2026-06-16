# EventHub Playwright Automation

This repository contains end-to-end automation tests for the **EventHub** web application using **Playwright with JavaScript**.

The project covers event creation, ticket booking, booking confirmation, seat count validation, and refund eligibility validation for single-ticket and group-ticket booking scenarios.

## Application Under Test

**EventHub Application:**
`https://eventhub.rahulshettyacademy.com`

## Tech Stack

* Playwright
* JavaScript
* Node.js
* Playwright Test Runner
* VS Code
* Git and GitHub

## Assignments Overview

This repository contains multiple Playwright test files. The main assignment files are:

| Assignment   | Test File                   | Purpose                                                                                                             |
| ------------ | --------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Assignment 1 | `tests/Assignment.spec.js`  | Creates a new event, books one ticket, validates booking confirmation, and verifies that seat count is reduced by 1 |
| Assignment 2 | `tests/Assignment2.spec.js` | Validates refund eligibility for single-ticket and group-ticket bookings                                            |

---

# Assignment 1 - Event Creation, Booking and Seat Reduction

## Objective

The objective of Assignment 1 is to automate the complete event creation and ticket booking flow.

This assignment validates that after booking one ticket for a newly created event, the available seat count is reduced by 1.

## Test File

```text
tests/Assignment.spec.js
```

## Scenario Covered

### Create Event, Book One Ticket and Verify Seat Reduction

This test validates the following flow:

1. Login to the EventHub application.
2. Navigate to the Admin Events page.
3. Create a new event with a unique title.
4. Navigate to the Events page.
5. Find the newly created event card.
6. Capture the available seat count before booking.
7. Book one ticket for the event.
8. Validate booking confirmation.
9. Navigate back to the Events page.
10. Capture the available seat count after booking.
11. Verify that the seat count is reduced by 1.

## Expected Result

The test should pass when:

* Login is successful.
* Event is created successfully.
* Newly created event is visible on the Events page.
* Seat count before booking is captured.
* One ticket is booked successfully.
* Booking reference is visible.
* Seat count after booking is reduced by 1.

## Important Validations

```js
await expect(page.getByText('Event created!')).toBeVisible();
await expect(page.locator('#ticket-count')).toContainText('1');
await expect(ref).toBeVisible();
expect(seatsAfterBooking).toBe(seatsBeforeBooking - 1);
```

## Playwright Concepts Used in Assignment 1

* Browser context creation
* Page creation
* Reusable login helper function
* Page navigation using `page.goto()`
* Locators
* `getByPlaceholder()`
* `getByLabel()`
* `getByRole()`
* `getByText()`
* CSS selectors
* `filter({ hasText })`
* Reading text using `innerText()`
* Extracting numbers using regular expression
* Assertions using `expect`
* `test.step()` for readable test reports
* Dynamic test data using `Date.now()`

---

# Assignment 2 - Refund Eligibility Validation

## Objective

The objective of Assignment 2 is to validate refund eligibility logic after booking tickets.

This assignment covers two refund scenarios:

1. Single-ticket booking is eligible for refund.
2. Group-ticket booking with 3 tickets is not eligible for refund.

## Test File

```text
tests/Assignment2.spec.js
```

## Scenarios Covered

## Test 1 - Single Ticket Booking is Eligible for Refund

This test validates that when a user books only one ticket for an event, the booking is eligible for a full refund.

### Test Flow

1. Login to the EventHub application.
2. Navigate to the Events page.
3. Select the first available event.
4. Book one ticket with customer details.
5. Navigate to My Bookings.
6. Open the booking details page.
7. Validate booking reference.
8. Click on **Check eligibility for refund?**
9. Wait for the refund spinner to disappear.
10. Validate refund eligibility result.

### Expected Result

The refund result should contain:

```text
Eligible for refund
```

and

```text
Single-ticket bookings qualify for a full refund
```

## Test 2 - Group Ticket Booking is Not Eligible for Refund

This test validates that when a user books 3 tickets for an event, the booking is not eligible for a refund.

### Test Flow

1. Login to the EventHub application.
2. Navigate to the Events page.
3. Select the first available event.
4. Increase ticket quantity from 1 to 3 by clicking the `+` button twice.
5. Validate that ticket count is updated to 3.
6. Fill customer details.
7. Confirm the booking.
8. Navigate to My Bookings.
9. Open the booking details page.
10. Validate booking reference.
11. Click on **Check eligibility for refund?**
12. Wait for the refund spinner to disappear.
13. Validate refund eligibility result.

### Expected Result

The refund result should contain:

```text
Not eligible for refund
```

and

```text
Group bookings (3 tickets) are non-refundable
```

## Important Validations

```js
await expect(page.locator('#ticket-count')).toContainText('3');

await expect(refundResult).toContainText('Not eligible for refund');

await expect(refundResult).toContainText(
  'Group bookings (3 tickets) are non-refundable'
);
```

## Playwright Concepts Used in Assignment 2

* Browser context creation
* Reusable login helper function
* Page navigation
* `getByPlaceholder()`
* `getByLabel()`
* `getByRole()`
* `getByText()`
* `getByTestId()`
* CSS selectors
* Text-based locator using `button:has-text("+")`
* Reading text using `innerText()`
* Assertions using `expect`
* `test.step()` for better test reporting
* Handling loading spinner
* Validating dynamic UI text

---

# Important Locators Used

## Login Page

```js
page.getByPlaceholder('you@email.com')
page.getByLabel('Password')
page.locator('#login-btn')
page.getByRole('link', { name: 'Browse Events →' })
```

## Admin Event Creation Page

```js
page.locator('#event-title-input')
page.locator('#admin-event-form textarea')
page.getByLabel('City')
page.getByLabel('Venue')
page.getByLabel('Event Date & Time')
page.getByLabel('Price ($)')
page.getByLabel('Total Seats')
page.locator('#add-event-btn')
```

## Events Page

```js
page.locator('#event-card')
page.getByTestId('event-card')
events.filter({ hasText: title })
matchcard.getByText(/seat/i)
matchcard.locator('[data-testid="book-now-btn"]')
page.getByTestId('book-now-btn')
```

## Booking Page

```js
page.locator('#ticket-count')
page.locator('button:has-text("+")')
page.getByLabel('Full Name')
page.getByPlaceholder('Your full name')
page.locator('#customer-email')
page.getByPlaceholder('you@email.com')
page.getByLabel('Phone Number')
page.getByPlaceholder('+91 98765 43210')
page.locator('.confirm-booking-btn')
page.locator('#confirm-booking')
```

## Booking Details and Refund Validation

```js
page.getByRole('link', { name: 'View My Bookings' })
page.getByTestId('booking-card')
page.getByRole('button', { name: 'View Details' })
page.locator('span.font-mono.font-bold')
page.locator('h1')
page.getByText('Check eligibility for refund?')
page.locator('#refund-spinner')
page.locator('#refund-result')
```

---

# Helper Functions

## Login Helper Function

A reusable login helper function is used to avoid repeating login steps in every test.

```js
async function login(page) {
  await page.goto(`${BASE_URL}/login`);
  await page.getByPlaceholder('you@email.com').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.locator('#login-btn').click();
  await expect(page.getByRole('link', { name: 'Browse Events →' })).toBeVisible();
}
```

## Future Date Helper Function

Assignment 1 uses a helper function to generate a future event date.

The event date field expects a value in this format:

```text
yyyy-MM-ddTHH:mm
```

Helper function:

```js
function futureDateValue() {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return date.toISOString().slice(0, 16);
}
```

This creates a date 7 days from today and formats it correctly for the event date field.

---

# Project Structure

```text
PlayWrightAutomation
│
├── tests
│   ├── Assignment.spec.js       # Assignment 1 - Event creation, booking and seat reduction
│   ├── Assignment2.spec.js      # Assignment 2 - Refund eligibility validation
│   ├── Calendar.spec.js
│   ├── ClientApp.spec.js
│   ├── example.spec.js
│   └── UIbasictest.spec.js
│
├── .gitignore
├── README.md
├── package.json
├── package-lock.json
└── playwright.config.js
```

---

# How to Install the Project

Clone the repository:

```bash
git clone https://github.com/your-username/playwright-eventhub-automation.git
```

Navigate to the project folder:

```bash
cd playwright-eventhub-automation
```

Install dependencies:

```bash
npm install
```

Install Playwright browsers:

```bash
npx playwright install
```

---

# How to Run the Tests

Run all tests:

```bash
npx playwright test
```

Run Assignment 1 test file:

```bash
npx playwright test tests/Assignment.spec.js
```

Run Assignment 2 test file:

```bash
npx playwright test tests/Assignment2.spec.js
```

Run tests in headed mode:

```bash
npx playwright test --headed
```

Run Assignment 1 in headed mode:

```bash
npx playwright test tests/Assignment.spec.js --headed
```

Run Assignment 2 in headed mode:

```bash
npx playwright test tests/Assignment2.spec.js --headed
```

Run tests in debug mode:

```bash
npx playwright test tests/Assignment.spec.js --debug
```

```bash
npx playwright test tests/Assignment2.spec.js --debug
```

---

# How to View HTML Report

After test execution, open the Playwright HTML report:

```bash
npx playwright show-report
```

The report shows:

* Test result
* Step-by-step execution
* Passed and failed steps
* Error details
* Screenshots and traces if enabled

---

# Git Commands Used

Initialize Git:

```bash
git init
```

Check file status:

```bash
git status
```

Add all files:

```bash
git add .
```

Add a specific file:

```bash
git add tests/Assignment.spec.js
```

Commit changes:

```bash
git commit -m "Add Playwright EventHub automation tests"
```

Push code to GitHub:

```bash
git push
```

---

# .gitignore

The project includes a `.gitignore` file to avoid committing unnecessary files and folders.

Recommended `.gitignore` content:

```gitignore
node_modules/
playwright-report/
test-results/
.env
```

## Why These Are Ignored

| File/Folder          | Reason                                                                   |
| -------------------- | ------------------------------------------------------------------------ |
| `node_modules/`      | Contains installed npm packages and can be recreated using `npm install` |
| `playwright-report/` | Generated Playwright HTML report                                         |
| `test-results/`      | Generated screenshots, traces, videos and test logs                      |
| `.env`               | May contain private credentials                                          |

---

# Security Note

Do not commit real login credentials to GitHub.

Avoid this in public repositories:

```js
const email = 'real-email@gmail.com';
const password = 'real-password';
```

Use dummy values or environment variables instead:

```js
const email = process.env.EVENTHUB_EMAIL;
const password = process.env.EVENTHUB_PASSWORD;
```

Also make sure `.env` is added to `.gitignore`.

---

# Author

Sahana Navalgatti

---

# Project Status

Assignment 1 and Assignment 2 are completed.

* Assignment 1 validates event creation, single-ticket booking, booking confirmation, and seat count reduction.
* Assignment 2 validates refund eligibility for single-ticket and group-ticket booking scenarios.
