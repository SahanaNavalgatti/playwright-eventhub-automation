// Importing test and expect from Playwright Test package.
// test   -> used to write test cases.
// expect -> used for assertions/validations.
const { test, expect } = require('@playwright/test');

// Base URL of the EventHub application.
const BASE_URL = 'https://eventhub.rahulshettyacademy.com';

// Test credentials.
// IMPORTANT: Do not upload real credentials to GitHub.
// Use dummy credentials or environment variables for public projects.
const email = 'your-email@example.com';
const password = 'your-password';

// These variables are declared outside the test steps
// because their values are needed in multiple steps.
let title;
let matchcard;
let events;
let seatsBeforeBooking;

/**
 * Reusable login helper function.
 * This function logs into the EventHub application.
 */
async function login(page) {
  // Navigate to login page.
  await page.goto(`${BASE_URL}/login`);

  // Enter email.
  await page.getByPlaceholder('you@email.com').fill(email);

  // Enter password.
  await page.getByLabel('Password').fill(password);

  // Click Login button.
  await page.locator('#login-btn').click();

  // Validate successful login by checking Browse Events link.
  await expect(page.getByRole('link', { name: 'Browse Events →' })).toBeVisible();
}

/**
 * Helper function to generate a future event date.
 * The event date field expects value in this format:
 * yyyy-MM-ddTHH:mm
 */
function futureDateValue() {
  const date = new Date();

  // Add 7 days to today's date.
  date.setDate(date.getDate() + 7);

  // Convert date to ISO format and take only yyyy-MM-ddTHH:mm part.
  return date.toISOString().slice(0, 16);
}

/**
 * Assignment 1:
 * 1. Login to EventHub
 * 2. Create a new event from Admin page
 * 3. Capture available seats before booking
 * 4. Book one ticket
 * 5. Validate booking confirmation
 * 6. Verify seat count is reduced by 1
 */
test('Create event, book ticket and verify seat reduction', async ({ browser }) => {
  // Create a new browser context.
  // A context is like a fresh/incognito browser session.
  const context = await browser.newContext();

  // Create a new page/tab inside the browser context.
  const page = await context.newPage();

  // Login to application.
  await login(page);

  await test.step('Step 1 - Create a new event from Admin page', async () => {
    // Navigate to Admin Events page.
    await page.goto(`${BASE_URL}/admin/events`);

    // Create a unique event title using current timestamp.
    // This avoids duplicate event title issues.
    title = `Test event ${Date.now()}`;

    // Fill event details.
    await page.locator('#event-title-input').fill(title);
    await page.locator('#admin-event-form textarea').fill('New Event Created');
    await page.getByLabel('City').fill('Belgaum');
    await page.getByLabel('Venue').fill('KPTCL');
    await page.getByLabel('Event Date & Time').fill(futureDateValue());
    await page.getByLabel('Price ($)').fill('200');
    await page.getByLabel('Total Seats').fill('50');

    // Submit event creation form.
    await page.locator('#add-event-btn').click();

    // Validate event creation success message.
    await expect(page.getByText('Event created!')).toBeVisible();
  });

  await test.step('Step 2 - Read created event card and capture seats before booking', async () => {
    // Navigate to Events page.
    await page.goto(`${BASE_URL}/events`);

    // Locate all event cards.
    events = page.locator('#event-card');

    // Verify at least one event card is visible.
    await expect(events.first()).toBeVisible();

    // Find the newly created event card using the unique event title.
    matchcard = events.filter({ hasText: title });

    // Validate that the matching event card is visible.
    await expect(matchcard).toBeVisible({ timeout: 5000 });

    // Read seat text from the matching event card.
    // Example: "50 seats available"
    const seat = await matchcard.getByText(/seat/i).innerText();

    console.log('Seat text before booking:', seat);

    // Extract numeric seat count from the seat text.
    // /\d+/ finds the first number in the text.
    // parseInt converts that number from string to integer.
    seatsBeforeBooking = parseInt(seat.match(/\d+/)[0]);

    console.log('Seats before booking:', seatsBeforeBooking);
  });

  await test.step('Step 3 - Book one ticket for the created event', async () => {
    // Click Book Now button inside the matched event card.
    await matchcard.locator('[data-testid="book-now-btn"]').click();

    // Validate default ticket count is 1.
    await expect(page.locator('#ticket-count')).toContainText('1');

    // Fill customer details.
    await page.getByLabel('Full Name').fill('Sahana N');
    await page.locator('#customer-email').fill('xyz@gmail.com');
    await page.getByPlaceholder('+91 98765 43210').fill('1234567892');

    // Confirm booking.
    await page.locator('.confirm-booking-btn').click();
  });

  await test.step('Step 4 - Validate booking confirmation', async () => {
    // Locate booking reference on confirmation page.
    const ref = page.locator('.booking-ref').first();

    // Validate booking reference is visible.
    await expect(ref).toBeVisible();

    // Read booking reference text.
    const bookingRef = (await ref.innerText()).trim();

    console.log('Booking Reference:', bookingRef);
  });

  await test.step('Step 5 - Validate seat count is reduced by 1 after booking', async () => {
    // Navigate back to Events page.
    await page.goto(`${BASE_URL}/events`);

    // Re-create event card locator after page navigation.
    events = page.locator('#event-card');

    // Verify event cards are visible.
    await expect(events.first()).toBeVisible();

    // Find the same event again using event title.
    matchcard = events.filter({ hasText: title });

    // Validate matching event card is visible.
    await expect(matchcard).toBeVisible({ timeout: 5000 });

    // Read updated seat text after booking.
    const seat = await matchcard.getByText(/seat/i).innerText();

    console.log('Seat text after booking:', seat);

    // Extract updated seat count.
    const seatsAfterBooking = parseInt(seat.match(/\d+/)[0]);

    console.log('Seats after booking:', seatsAfterBooking);

    // Validate that seats after booking = seats before booking - 1.
    expect(seatsAfterBooking).toBe(seatsBeforeBooking - 1);
  });

  // Close browser context after test execution.
  await context.close();
});