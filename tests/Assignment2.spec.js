
const { test, expect } = require('@playwright/test');
const { TIMEOUT } = require('node:dns');

const BASE_URL ='https://eventhub.rahulshettyacademy.com' ;
const email ='sony77navalgatti@gmail.com';
const password= 'Hope@2026';

async function loginAndGoToBooking(page){

await page.goto(`${BASE_URL}/login`);
    await page.getByPlaceholder('you@email.com').fill(email);
    await page.getByLabel('Password').fill(password);
    await page.locator('#login-btn').click();
    await expect(page.getByRole('link',{name:'Browse Events →'})).toBeVisible();
   
};


test('Group ticket booking is eligible for refund', async({browser}) => {

const context = await browser.newContext();
const page= await context.newPage();
await loginAndGoToBooking(page)


await test.step('Navigate to Events',async()=>{


await page.goto(`${BASE_URL}/events`);
await page.locator('[data-testid="event-card"]')
.first()
.locator('[data-testid="book-now-btn"]')
.click();
await page.getByPlaceholder('Your full name').fill('Sahana N');
await page.getByPlaceholder('you@email.com').fill('sahana@gmail.com');
await page.getByLabel('Phone Number').fill('1678992345');
await page.locator('.confirm-booking-btn').click();

});


await test.step('Navigate to Booking detail',async()=>{


    await page.getByRole('link',{name:'View My Bookings'}).click();
    await expect (page).toHaveURL(`${BASE_URL}/bookings`);
    await page.getByRole('link',{name:'View Details'}).first().click();
    await expect(page.getByText('Booking Information')).toBeVisible();



});

await test.step('Validate booking ref',async()=>{

const bookingref = await page.locator('span.font-mono.font-bold').innerText();
const titleRef = await page.locator('h1').innerText();
console.log("bookingref",bookingref);
console.log("titlref",titleRef);
await expect (bookingref.charAt(0)).toBe(titleRef.charAt(0));
});

await test.step('Check refund eligiblity',async()=>{


await page.getByText('Check eligibility for refund?').click();
await expect (page.locator('#refund-spinner')).toBeVisible();
await expect (page.locator('#refund-spinner')).toBeHidden({timeout:6000});
});



await test.step('Verify Elibligity',async()=>{

await expect (page.locator('#refund-result')).toBeVisible();
await expect(page.locator('#refund-result')).toContainText('Eligible for refund');
await expect(page.locator('#refund-result')).toContainText('Single-ticket bookings qualify for a full refund');



});

await context.close();
});


  



test('Group ticket booking is NOT eligible for refund', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();

  await loginAndGoToBooking(page);

  await test.step('Navigate to Events and book group ticket', async () => {
    await page.goto(`${BASE_URL}/events`);

    await page
      .getByTestId('event-card')
      .first()
      .getByTestId('book-now-btn')
      .click();

    // Increase quantity from 1 to 3
    await page.locator('button:has-text("+")').click();
    await page.locator('button:has-text("+")').click();

    await expect(page.locator('#ticket-count')).toContainText('3');

    await page.getByPlaceholder('Your full name').fill('Sahana N');
    await page.getByPlaceholder('you@email.com').fill('sahana@gmail.com');
    await page.getByLabel('Phone Number').fill('1234567892');

    await page.locator('#confirm-booking').click();
  });

  await test.step('Go to My Bookings and open details', async () => {
    await page.getByRole('link', { name: 'View My Bookings' }).click();

    await expect(page).toHaveURL(`${BASE_URL}/bookings`);

    await page
      .getByTestId('booking-card')
      .first()
      .getByRole('button', { name: 'View Details' })
      .click();

    await expect(page.getByText('Booking Information')).toBeVisible();
  });


await test.step('Validate booking ref',async()=>{

const bookingref = await page.locator('span.font-mono.font-bold').innerText();
const titleRef = await page.locator('h1').innerText();
console.log("bookingref",bookingref);
console.log("titlref",titleRef);
await expect (bookingref.charAt(0)).toBe(titleRef.charAt(0));
});

await test.step('Check refund eligiblity',async()=>{


await page.getByText('Check eligibility for refund?').click();
await expect (page.locator('#refund-spinner')).toBeVisible();
await expect (page.locator('#refund-spinner')).toBeHidden({timeout:6000});

});

  await test.step('Validate refund result for group booking', async () => {
    const refundResult = page.locator('#refund-result');

    await expect(refundResult).toBeVisible();

    await expect(refundResult).toContainText('Not eligible for refund');

    await expect(refundResult).toContainText(
      'Group bookings (3 tickets) are non-refundable'
    );
  });

  await context.close();
});



