# EventHub Playwright Automation - Assignment 2

This project contains end-to-end automation tests for the **EventHub** web application using **Playwright with JavaScript**.

The main focus of this assignment is to validate the **event booking flow** and **refund eligibility logic** for different ticket quantities.

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

## Assignment 2 Objective

The objective of this assignment is to automate refund eligibility scenarios after booking event tickets.

This assignment covers two important scenarios:

1. A **single-ticket booking** should be eligible for refund.
2. A **group-ticket booking with 3 tickets** should not be eligible for refund.

## Test File

The test scenarios are implemented in:

```text
tests/Assignment2.spec.js
```

## Test Scenarios Covered

### Test 1: Single Ticket Booking is Eligible for Refund

This test validates that when a user books only one ticket for an event, the booking is eligible for a full refund.

#### Test Flow

1. Launch the EventHub application.
2. Login using valid credentials.
3. Navigate to the Events page.
4. Select the first available event.
5. Book one ticket with customer details.
6. Navigate to My Bookings.
7. Open the booking details page.
8. Validate booking reference.
9. Click on **Check eligibility for refund?**
10. Wait for the refund spinner to disappear.
11. Verify that the refund result contains:

* `Eligible for refund`
* `Single-ticket bookings qualify for a full refund`

#### Expected Result

The application should display that the booking is eligible for refund.

---

### Test 2: Group Ticket Booking is Not Eligible for Refund

This test validates that when a user books 3 tickets for an event, the booking is not eligible for a refund.

#### Test Flow

1. Launch the EventHub application.
2. Login using valid credentials.
3. Navigate to the Events page.
4. Select the first available event.
5. Increase ticket quantity from 1 to 3 by clicking the `+` button twice.
6. Validate that ticket count is updated to 3.
7. Fill customer details.
8. Confirm the booking.
9. Navigate to My Bookings.
10. Open the booking details page.
11. Validate booking reference.
12. Click on **Check eligibility for refund?**
13. Wait for the refund spinner to disappear.
14. Verify that the refund result contains:

* `Not eligible for refund`
* `Group bookings (3 tickets) are non-refundable`

#### Expected Result

The application should display that group bookings with 3 tickets are not eligible for refund.

## Playwright Concepts Used

This assignment uses the following Playwright concepts:

* Browser context creation
* Page navigation
* Reusable login helper function
* Locators
* `getByPlaceholder()`
* `getByLabel()`
* `getByRole()`
* `getByText()`
* `getByTestId()`
* CSS selectors
* Text-based locator using `button:has-text("+")`
* Assertions using `expect`
* `test.step()` for better test reporting
* Handling loading spinner
* Validating dynamic UI text
* Reading text using `innerText()`

## Important Locators Used

### Login Page

```js
page.getByPlaceholder('you@email.com')
page.getByLabel('Password')
page.locator('#login-btn')
```

### Event Booking

```js
page.getByTestId('event-card')
page.getByTestId('book-now-btn')
page.locator('button:has-text("+")')
page.locator('#ticket-count')
page.locator('#confirm-booking')
```

### Booking Details and Refund Validation

```js
page.getByRole('link', { name: 'View My Bookings' })
page.getByTestId('booking-card')
page.getByRole('button', { name: 'View Details' })
page.locator('#refund-spinner')
page.locator('#refund-result')
```

## How to Install the Project

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

## How to Run the Tests

Run all tests:

```bash
npx playwright test
```

Run only Assignment 2 test file:

```bash
npx playwright test tests/Assignment2.spec.js
```

Run tests in headed mode:

```bash
npx playwright test tests/Assignment2.spec.js --headed
```

Run tests in debug mode:

```bash
npx playwright test tests/Assignment2.spec.js --debug
```

## How to View HTML Report

After test execution, open the Playwright report using:

```bash
npx playwright show-report
```

The report shows:

* Test status
* Passed and failed tests
* Step-by-step execution
* Error details
* Screenshots and traces if enabled

## Project Structure

```text
PlayWrightAutomation
│
├── tests
│   ├── Assignment.spec.js
│   ├── Assignment2.spec.js
│   ├── Calendar.spec.js
│   ├── ClientApp.spec.js
│   ├── example.spec.js
│   └── UIbasictest.spec.js
│
├── .gitignore
├── package.json
├── package-lock.json
└── playwright.config.js
```

## Notes

* The project uses Playwright Test Runner.
* The tests are written in JavaScript.
* `test.step()` is used to make the Playwright report more readable.
* The refund eligibility result appears only after clicking **Check eligibility for refund?**
* The spinner is validated before checking the refund result.
* Group booking is created by clicking the `+` button twice to make the ticket quantity 3.

## Security Note

Do not commit real login credentials to GitHub.

Instead of hardcoding credentials like this:

```js
const email = 'real-email@gmail.com';
const password = 'real-password';
```

Use dummy test values or environment variables for public repositories.

Example:

```js
const email = process.env.EVENTHUB_EMAIL;
const password = process.env.EVENTHUB_PASSWORD;
```

Also make sure `.env` is added to `.gitignore`.

```gitignore
.env
node_modules/
playwright-report/
test-results/
```

## Author

Sahana Navalgatti

## Project Status

Assignment 2 completed with automated validation for single-ticket and group-ticket refund eligibility scenarios.
