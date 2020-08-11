/* 
  cd /var/www/paulbrowne.dev
  git pull
  npm i
  pm2 restart all
*/

const puppeteer = require('puppeteer-extra');
 
// Add stealth plugin and use defaults (all tricks to hide puppeteer usage)
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
 
// Add adblocker plugin to block all ads and trackers (saves bandwidth)
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');
puppeteer.use(AdblockerPlugin({ blockTrackers: true }));

const RecaptchaPlugin = require('puppeteer-extra-plugin-recaptcha');
puppeteer.use(
  RecaptchaPlugin({
    provider: {
      id: '2captcha',
      token: 'cf2f180a51ab9da985b39e4d09a19b11' 
    },
    visualFeedback: true // colorize reCAPTCHAs (violet = detected, green = solved)
  })
);

const express = require('express');
const app = express();
const port = 3000;

// serve public from root
app.use('/', express.static('public'));


app.use('/tester', function(req, res){
    var x = req.headers["x-forwarded-for"] || "123.123.123.123";
    res.json({ip:x});
})

const credentials = [
  {
    username: "paulmatthewbrowne@gmail.com",
    password: ":$q7*UfRUQ$i*Hj"
  }
];

const waitFor = (ms) => new Promise(r => setTimeout(r, ms));

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

var running = false;

app.use('/like-my-post', function(req, res){
  if(!running){
    running = true;
    if(req.query.url){
      (async () => {
        const b = await puppeteer.launch({
          headless: true,
          args: ['--no-sandbox']
        });
        const p = await b.newPage();
        //await p.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36");
        //await p.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.105 Safari/537.36");
        await p.waitFor(1534);
        await p.goto(req.query.url);

        if(await p.$("body#error404")){
          running = false;
          res.send('<pre><code>post not found!</code></pre>');
          await b.close();        
        }else{
          const workplaceCard = await p.$(".share-update-card__actor-headline");
          const workplace = await p.evaluate(element => element.textContent, workplaceCard);

          const authorCard = await p.$(".share-update-card__actor-text");
          const author = await p.evaluate(element => element.textContent, authorCard);

          await b.close();

          if(~workplace.indexOf("at Columbia Road")){
            var response = `<h2><a href="${req.query.url}">This post</a></h2>
                            <pre>`;
            await asyncForEach(credentials, async (user, i) => {
              const browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox']
              });
              //const url = "https://www.linkedin.com/posts/eeromartela_digimyynti-digitalsales-digimarkkinointi-activity-6675997627793985537-YlDI/";
              const page = await browser.newPage();
              //await page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.105 Safari/537.36");
              await page.waitFor(2714);
              await page.goto(`https://www.linkedin.com/uas/login?session_redirect=${req.query.url}`);
              await page.waitFor(2534);
              await page.focus('#username');
              await page.keyboard.type(user.username);
              await page.waitFor(394);
              await page.focus('#password')
              await page.keyboard.type(user.password);
              await page.waitFor(513);
              await page.click('button[type="submit"]');
              await page.waitFor(4000);
              if (await page.$('#captchaInternalPath')){
                await page.waitFor(3000);

                // const inpCap = await page.$('[name="captchaSiteKey"]');
                // //const siteKey = await page.evaluate(element => element.value, inpCap);
                // await page.evaluate(element => element.setAttribute("data-sitekey", "6Lc7CQMTAAAAAIL84V_tPRYEWZtljsJQJZ5jSijw"), inpCap);

                // await page.waitFor(500);
                // await page.solveRecaptchas();

                // await Promise.all([
                //   page.waitForNavigation(),
                //   page.waitFor(6000)
                // ])

                response += `<code>${user.username} captcha triggered, try again tomorrow!</code><br>`;
                running = false;
                await browser.close();

              }else if (await page.$('#password.form__input--error')){
                response += `<code><b>wrong password</b> ${user.username}</code><br>`;
                running = false;
                await browser.close();
              }else if (await page.$('#username.form__input--error')){
                response += `<code><b>wrong username</b> ${user.username}</code><br>`;
                running = false;
                await browser.close();
              }else{

                const userCard = await page.$(".global-nav__me-photo");
                const loggedInUser = await page.evaluate(element => element.getAttribute("alt"), userCard);
                
                if(loggedInUser == author.trim()){
                  response += `<code>${loggedInUser} is the author</code><br>`;
                  await browser.close();
                }else{
                  //const loc = await page.evaluate(() => {return location.href });
                  await page.waitFor(4000);
                  if (await page.$('button[aria-pressed="false"][aria-label^="Like"][aria-label$="post"]') !== null){
                    await page.click('button[aria-pressed="false"][aria-label^="Like"][aria-label$="post"]');
                    await page.waitFor(1033);
                    response += `<code>${loggedInUser} liked ${author.trim()}'s post!</code><br>`;
                    await browser.close();
                  }else{
                    response += `<code>${loggedInUser} has already liked ${author.trim()}'s post!</code><br>`;
                    await browser.close();
                  }
                  //await page.click('.share-reshare-button button');
                  //await page.waitFor(853);
                  //await page.click('button[data-control-name="share.post"]');
                  //await page.waitFor(250000);
                }
              }
            })
            running = false;
            res.send(response + "</pre>");
          }else{
            running = false;
            res.send(`<pre><code>${author.trim()} does not work for us</code></pre>`);
          }
        }
      })();
    }else{
      running = false;
      res.send('<pre><code>no url</code></pre>');
    }
  }else{
    res.send('<pre><code>task already running!</code></pre>');
  }
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`));

