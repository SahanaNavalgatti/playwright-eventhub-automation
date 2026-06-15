const{test,expect}= require('@playwright/test');


test('BrowserContext PW Test',async  ({browser}) =>
{

    const context = await browser.newContext();
    const page = await context.newPage();
    const username = page.locator("#username");
    const password= page.locator("[name='password']");
    const cardTitles =page.locator("h4.card-title a");
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
     console.log(await page.title());
     //css
    await username.fill("rahulshetty");
    await password.fill("Learning@830$3mK2");
    await page.locator("input#signInBtn").click();
     console.log(await page.locator("[style*='block']").textContent());
    await expect(page.locator("[style*='block']")).toContainText("Incorrect");
    //to clear
    await username.fill("");
    await username.fill("rahulshettyacademy");
    await page.locator("input#signInBtn").click();
    //console.log(await cardTitles.first().textContent());
   // console.log(await cardTitles.nth(3).textContent());
    //return all titles 
    console.log(await cardTitles.allTextContents());



   

});

test ('UI Controls',async  ({page}) =>
{
    const username = page.locator("#username");
    const password= page.locator("[name='password']");
 await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    console.log(await page.title());
    await username.fill("rahulshettyacademy");
    await password.fill("Learning@830$3mK2");
    const dropdown= page.locator("select.form-control");
    await dropdown.selectOption("Consultant");
    //radio 
    await page.locator("span.radiotextsty").last().click();
    //assertion
    await expect( page.locator("span.radiotextsty").last()).toBeChecked();
    //web popup
    await page.locator("#okayBtn").click();
    //check box
    await page.locator("#terms").click();
    //assertion
    await expect(page.locator("#terms")).toBeChecked();
    //to uncheck
    await page.locator("#terms").uncheck();
    //No assertions for uncheck
    //expect(page.locator("#terms").isChecked()).toBeFalsy();
    //just return true or flase
    console.log(await ( page.locator("span.radiotextsty").last()).isChecked());
  

});

test.only('@Child windows hadl', async ({browser})=>
 {
    const context = await browser.newContext();
    const page =  await context.newPage();
    const userName = page.locator('#username');
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    const documentLink = page.locator("[href*='documents-request']");

    //to check if link is blinking
    await expect(documentLink).toHaveAttribute("class","blinkingText");
 
    const [newPage]=await Promise.all(
   [
      context.waitForEvent('page'),//listen for any new page pending,rejected,fulfilled
      documentLink.click(),
   
   ])//new page is opened
   
 
   const  text = await newPage.locator(".red").textContent();
    const arrayText = text.split("@")
    const domain =  arrayText[1].split(" ")[0]
    //console.log(domain);
    await page.locator("#username").fill(domain);
    console.log(await page.locator("#username").inputValue());
 
 })
 
