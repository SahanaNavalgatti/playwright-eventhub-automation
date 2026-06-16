

const {test,expect}=  require('@playwright/test');

test('More Validations',async({page})=>{
//Navigations
await page.goto('https://rahulshettyacademy.com/AutomationPractice/');
//await page.goto('https://www.google.com/');
//await page.goBack();
//await page.goForward();

//Hidden Elements

await expect(page.locator('#displayed-text')).toBeVisible();
await page.locator('#hide-textbox').click();
await expect(page.locator('#displayed-text')).toBeHidden();
await page.pause();

//popups
await page.on('dialog', async dialog => {

    await console.log(dialog.message());
    await dialog.accept();

});

await page.locator('#confirmbtn').click();






//Hoverover 

await page.locator('#mousehover').hover();

//iframes

const framepage =page.frameLocator('#courses-iframe');
await framepage.locator("li a[href*='lifetime-access']:visible").click();
 const textCheck = await framepage.locator(".text h2").textContent();
 console.log(textCheck.split(" ") [1]);


 });