const{test,expect}= require('@playwright/test');

test ('Page PW test',async  ({page}) =>
{
 await page.goto("https://rahulshettyacademy.com/client");
    console.log(await page.title());
   
    await expect(page).toHaveTitle("Let's Shop"); 
    await page.locator("[type='email']").fill("sony77navalgatti@gmail.com");
    await page.locator("[type='password']").fill("Hope@2026");
    await page.locator("input#login").click();
   // console.log(await page.locator(".card-body b").first().textContent());
    //console.log(await page.locator(".card-body b").nth(2).textContent());
    await page.waitForLoadState('networkidle');
   
    await page.locator(".card-body b").first().waitFor();
    const tiles = await page.locator(".card-body b").allTextContents();
    console.log(tiles);

   

});

test('Client App Login', async ({page})=>{
     const email ="sony77navalgatti@gmail.com";
     const products = page.locator(".card-body");
     await page.goto("https://rahulshettyacademy.com/client");
     await page.locator("[type='email']").fill(email);
     await page.locator("[type='password']").fill("Hope@2026");
     await page.locator("input#login").click();
     await page.waitForLoadState('networkidle');
     await page.locator(".card-body b").first().waitFor();
 
     const count = await products.count();
     for(let i =0;i<count;++i){

        if (await products.nth(i).locator("b").textContent()==="ADIDAS ORIGINAL"){

              await products.nth(i).locator("text= Add To Cart").click();

        }
        break;

     }

     await page.locator("[routerlink*='cart']").click();
     //waiting for page to load
     await page.locator("div li").first().waitFor();
     const bool=page.locator("h3:has-text('ADIDAS ORIGINAL')").isVisible();
     expect(bool).toBeTruthy();
    await  page.locator("text=Checkout").click();
    await page.locator("[placeholder*='Country']").pressSequentially("ind");
    const dropdown = page.locator(".ta-results");
    await dropdown.waitFor();
    const optionscount = await dropdown.locator("button").count();
    console.log(optionscount);
    for(let i=0;i<optionscount;++i){
      const text = await dropdown.locator("button").nth(i).textContent();
      if( text ===" India"){

      await dropdown.locator("button").nth(i).click();
      break;

      }


    }

   await expect(page.locator(".user__name  [type='text']").first()).toHaveText(email);
   await page.locator(".action__submit").click();
   await expect(page.locator(".hero-primary")).toHaveText(" Thankyou for the order. ");
   const orderId= await page.locator("label.ng-star-inserted").textContent();
   console.log(orderId);

   await page.locator("button[routerlink='/dashboard/myorders']").click();
   await page.locator("tbody").waitFor();
   const rows = await page.locator("tbody tr th").count();
   console.log(rows);

   for(let i=0;i<rows;++i){

const orderidvalue = await page.locator("tbody tr th").nth(i).textContent();

if(orderId.includes(orderidvalue))
{

await page.locator("tbody tr").nth(i).locator("button").first().click();
break;

}
}

    const orderIdDetails = await page.locator(".col-text").textContent();
     expect(orderId.includes(orderIdDetails)).toBeTruthy();



     await page.pause();


}





)

