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
    const url = "https://www.linkedin.com/posts/eeromartela_digimyynti-digitalsales-digimarkkinointi-activity-6675997627793985537-YlDI/";
    const page = await browser.newPage();
    await page.goto(`https://www.linkedin.com/uas/login?session_redirect=${url}`);
    await page.waitFor(3534);
    await page.focus('#username');
    await page.keyboard.type(user.username);
    await page.waitFor(394);
    await page.focus('#password')
    await page.keyboard.type(user.password);
    await page.waitFor(513);
    await page.click('button[type="submit"]');
    await page.waitForNavigation();
    if (await page.$('button[aria-pressed="false"][aria-label^="Like"][aria-label$="post"]') !== null){
      await page.click('button[aria-pressed="false"][aria-label^="Like"][aria-label$="post"]');
      await page.waitFor(1033);
      await browser.close();
    }else{
      await browser.close();
    }
  })();
});