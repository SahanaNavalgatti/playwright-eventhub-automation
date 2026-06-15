//We are importing test and expect from playwright test package from node modules 
//test-to write test cases and expect for assertions

const{test,expect}= require('@playwright/test');

const BASE_URL ='https://eventhub.rahulshettyacademy.com' ;
const email ='sony77navalgatti@gmail.com';
const password= 'Hope@2026';
let title ;
let matchcard;
let events;
let seatsBeforeBooking;


//Creating Login Helper function

async function login(page) {

    await page.goto(`${BASE_URL}/login`);
    //await page.goto(BASE_URL + '/login');
    await page.getByPlaceholder('you@email.com').fill(email);
    await page.getByLabel('Password').fill(password);
    await page.locator('#login-btn').click();
    await expect(page.getByRole('link',{name: 'Browse Events →'})).toBeVisible();
}

 function futureDateValue(){
 
    const date = new Date();
    date.setDate(date.getDate()+7);
    return date.toISOString().slice(0,16);
    

}

test('Step Event Creation', async({browser})  =>{

    const context = await browser.newContext();
    const page = await context.newPage();
    await login(page);
    await page.goto(`${BASE_URL}/admin/events`);
     title = `Test event ${Date.now()}`;
    await page.locator('#event-title-input').fill(title);
    await page.locator('#admin-event-form textarea').fill('New Event Created');
    await page.getByLabel('City').fill('Belgaum');
    await page.getByLabel('Venue').fill('KPTCL');
    await page.getByLabel('Event Date & Time').fill(futureDateValue());
    await page.getByLabel('Price ($)').fill('200');
    await page.getByLabel('Total Seats').fill('50');
    await page.locator('#add-event-btn').click();
    await expect(page.getByText('Event created!')).toBeVisible();
    

await test.step('Step Read Event Cards',async()=>{

    await page.goto(`${BASE_URL}/events`);
    events = page.locator('#event-card');
    await expect(events.first()).toBeVisible();
     matchcard =  events.filter({hasText: title});
    await expect(matchcard).toBeVisible({timeout: 5000});
    const seat = await matchcard.getByText(/seat/i).innerText();
    console.log(seat);
     seatsBeforeBooking = parseInt(seat.match(/\d+/)[0]);
    console.log(seatsBeforeBooking);
    
   



});

await test.step('Step Booking',async()=>{

await matchcard.locator('[data-testid="book-now-btn"]').click();
await expect(page.locator('#ticket-count')).toContainText('1');
await page.getByLabel('Full Name').fill('Sahana N');
await page.locator('#customer-email').fill('xyz@gmail.com');
await page.getByPlaceholder('+91 98765 43210').fill('1234567892');
await page.locator('.confirm-booking-btn').click();


});


await test.step('Booking Confirmation',async()=>{


    const ref = page.locator('.booking-ref').first();
    await expect(ref).toBeVisible();
    const bookingRef = (await (ref.innerText())).trim();
    console.log(bookingRef);



});

await test.step('Seat Reduction', async()=>{

   await page.goto(`${BASE_URL}/events`);
   await expect(events.first()).toBeVisible();
   matchcard =  events.filter({hasText: title});
   await expect(matchcard).toBeVisible({timeout: 5000});
   const seat = await matchcard.getByText(/seat/i).innerText();
    console.log(seat);
    const seatsAfterBooking = parseInt(seat.match(/\d+/)[0]);
    await expect(seatsAfterBooking).toBe(seatsBeforeBooking-1);



});

//await context.close();
});


