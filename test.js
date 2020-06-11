const puppeteer = require("puppeteer");

const credentials = [
  {
    username: "paulmatthewbrowne@gmail.com",
    password: ":$q7*UfRUQ$i*Hj"
  }
];

credentials.forEach( function(user, index) {
  (async () => {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox']
    });
    await console.log(1);
    const url = "https://www.linkedin.com/posts/eeromartela_digimyynti-digitalsales-digimarkkinointi-activity-6675997627793985537-YlDI/";
    const page = await browser.newPage();
    await page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36");
    await console.log(2);
    await page.waitFor(3534);
    await page.goto(`https://www.linkedin.com/uas/login?session_redirect=${url}`);
    await console.log(3);
    await page.waitFor(3534);
    await page.focus('#username');
    await page.keyboard.type(user.username);
    await console.log(4);
    await page.waitFor(394);
    await page.focus('#password')
    await console.log(5);
    await page.keyboard.type(user.password);
    await page.waitFor(513);
    await console.log(6);
    await page.click('button[type="submit"]');
    await page.waitFor(5000);
    await console.log(7);
    const loc = await page.evaluate(() => {return location.href });
    await console.log(loc);
    await page.waitFor(5000);
    if (await page.$('button[aria-pressed="false"][aria-label^="Like"][aria-label$="post"]') !== null){
      await page.click('button[aria-pressed="false"][aria-label^="Like"][aria-label$="post"]');
      await page.waitFor(1033);
      await console.log("liked");
      await browser.close();
    }else{
      await console.log("already liked");
      await browser.close();
    }
    //await page.click('.share-reshare-button button');
    //await page.waitFor(853);
    //await page.click('button[data-control-name="share.post"]');
    //await page.waitFor(250000);
  })();
});