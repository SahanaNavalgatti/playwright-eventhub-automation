const { test, expect } = require('@playwright/test');

// Base application URL
const BASE_URL = 'https://eventhub.rahulshettyacademy.com';

// Test credentials
// Note: For real GitHub projects, store credentials in environment variables instead of hardcoding.
const email = 'your-email@example.com';
const password = 'your-password';

/**
 * Reusable login helper function.
 * This function logs into the EventHub application and verifies successful login
 * by checking that the "Browse Events" link is visible.
 */
async function loginAndGoToBooking(page) {
  await page.goto(`${BASE_URL}/login`);

  await page.getByPlaceholder('you@email.com').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.locator('#login-btn').click();

  await expect(page.getByRole('link', { name: 'Browse Events →' })).toBeVisible();
}

/**
 * Test 1:
 * Verifies that a single-ticket booking is eligible for refund.
 */
test('Single ticket booking is eligible for refund', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();

  await loginAndGoToBooking(page);

  await test.step('Navigate to Events and create single-ticket booking', async () => {
    await page.goto(`${BASE_URL}/events`);

    // Click "Book Now" on the first event card
    await page
      .locator('[data-testid="event-card"]')
      .first()
      .locator('[data-testid="book-now-btn"]')
      .click();

    // Fill booking form with customer details
    await page.getByPlaceholder('Your full name').fill('Sahana N');
    await page.getByPlaceholder('you@email.com').fill('sahana@gmail.com');
    await page.getByLabel('Phone Number').fill('1678992345');

    // Confirm booking
    await page.locator('.confirm-booking-btn').click();
  });

  await test.step('Navigate to booking details page', async () => {
    await page.getByRole('link', { name: 'View My Bookings' }).click();

    await expect(page).toHaveURL(`${BASE_URL}/bookings`);

    // Open the first booking details page
    await page.getByRole('link', { name: 'View Details' }).first().click();

    await expect(page.getByText('Booking Information')).toBeVisible();
  });

  await test.step('Validate booking reference and event title', async () => {
    // Booking reference is shown in a styled span at the top of booking details page
    const bookingRef = await page.locator('span.font-mono.font-bold').innerText();

    // Event title is displayed in the h1 heading
    const titleRef = await page.locator('h1').innerText();

    console.log('Booking Ref:', bookingRef);
    console.log('Title Ref:', titleRef);

    // Validate first character of booking reference matches first character of event title
    expect(bookingRef.charAt(0)).toBe(titleRef.charAt(0));
  });

  await test.step('Check refund eligibility', async () => {
    await page.getByText('Check eligibility for refund?').click();

    // Spinner should appear immediately after clicking eligibility check
    await expect(page.locator('#refund-spinner')).toBeVisible();

    // Spinner should disappear within 6 seconds
    await expect(page.locator('#refund-spinner')).toBeHidden({ timeout: 6000 });
  });

  await test.step('Verify eligible refund result', async () => {
    const refundResult = page.locator('#refund-result');

    await expect(refundResult).toBeVisible();
    await expect(refundResult).toContainText('Eligible for refund');
    await expect(refundResult).toContainText(
      'Single-ticket bookings qualify for a full refund'
    );
  });

  await context.close();
});

/**
 * Test 2:
 * Verifies that a group booking with 3 tickets is not eligible for refund.
 */
test('Group ticket booking is NOT eligible for refund', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();

  await loginAndGoToBooking(page);

  await test.step('Navigate to Events and start group ticket booking', async () => {
    await page.goto(`${BASE_URL}/events`);

    // Click "Book Now" on the first event card
    await page
      .getByTestId('event-card')
      .first()
      .getByTestId('book-now-btn')
      .click();

    // Default ticket quantity is 1.
    // Click + twice to increase quantity to 3.
    await page.locator('button:has-text("+")').click();
    await page.locator('button:has-text("+")').click();

    await expect(page.locator('#ticket-count')).toContainText('3');

    // Fill booking form
    await page.getByPlaceholder('Your full name').fill('Sahana N');
    await page.getByPlaceholder('you@email.com').fill('sahana@gmail.com');
    await page.getByLabel('Phone Number').fill('1234567892');

    // Confirm booking
    await page.locator('#confirm-booking').click();
  });

  await test.step('Go to My Bookings and open booking details', async () => {
    await page.getByRole('link', { name: 'View My Bookings' }).click();

    await expect(page).toHaveURL(`${BASE_URL}/bookings`);

    // Open details for the first booking card
    await page
      .getByTestId('booking-card')
      .first()
      .getByRole('button', { name: 'View Details' })
      .click();

    await expect(page.getByText('Booking Information')).toBeVisible();
  });

  await test.step('Validate booking reference and event title', async () => {
    const bookingRef = await page.locator('span.font-mono.font-bold').innerText();
    const titleRef = await page.locator('h1').innerText();

    console.log('Booking Ref:', bookingRef);
    console.log('Title Ref:', titleRef);

    expect(bookingRef.charAt(0)).toBe(titleRef.charAt(0));
  });

  await test.step('Check refund eligibility', async () => {
    await page.getByText('Check eligibility for refund?').click();

    await expect(page.locator('#refund-spinner')).toBeVisible();
    await expect(page.locator('#refund-spinner')).toBeHidden({ timeout: 6000 });
  });

  await test.step('Validate not eligible refund result for group booking', async () => {
    const refundResult = page.locator('#refund-result');

    await expect(refundResult).toBeVisible();
    await expect(refundResult).toContainText('Not eligible for refund');
    await expect(refundResult).toContainText(
      'Group bookings (3 tickets) are non-refundable'
    );
  });

  await context.close();
});