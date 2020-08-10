/* 
  cd /var/www/paulbrowne.dev
  git pull
  npm i
  pm2 restart all
*/

const puppeteer = require("puppeteer");
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

app.use('/like-my-post', function(req, res){
  if(req.query.url){
    (async () => {
      var response = `<h2><a href="req.query.url">This post</a></h2>
                      <pre>`;
      await asyncForEach(credentials, async (user, i) => {
        const browser = await puppeteer.launch({
          headless: true,
          args: ['--no-sandbox']
        });
        const url = "https://www.linkedin.com/posts/eeromartela_digimyynti-digitalsales-digimarkkinointi-activity-6675997627793985537-YlDI/";
        const page = await browser.newPage();
        await page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36");
        await page.waitFor(3534);
        await page.goto(`https://www.linkedin.com/uas/login?session_redirect=${req.query.url}`);
        await page.waitFor(3534);
        await page.focus('#username');
        await page.keyboard.type(user.username);
        await page.waitFor(394);
        await page.focus('#password')
        await page.keyboard.type(user.password);
        await page.waitFor(513);
        await page.click('button[type="submit"]');
        await page.waitFor(5000);
        if (await page.$('#captchaInternalPath')){
          response += `<code>there was a captcha challenge for ${user.username} <b>refresh this page and try again</b></code><br>`;
          await browser.close();
        }else if (await page.$('#password.form__input--error')){
          response += `<code><b>wrong password</b> ${user.username}</code><br>`;
          await browser.close();
        }else if (await page.$('#username.form__input--error')){
          response += `<code><b>wrong username</b> ${user.username}</code><br>`;
          await browser.close();
        }else{
          const loc = await page.evaluate(() => {return location.href });
          await page.waitFor(5000);
          if (await page.$('button[aria-pressed="false"][aria-label^="Like"][aria-label$="post"]') !== null){
            await page.click('button[aria-pressed="false"][aria-label^="Like"][aria-label$="post"]');
            await page.waitFor(1033);
            response += `<code>liked by ${user.username}</code><br>`;
            await browser.close();
          }else{
            response += `<code>already liked by ${user.username}</code><br>`;
            await browser.close();
          }
          //await page.click('.share-reshare-button button');
          //await page.waitFor(853);
          //await page.click('button[data-control-name="share.post"]');
          //await page.waitFor(250000);
        }
      })
      res.send(response + "</pre>");
    })();
/*
    credentials.forEach( function(user, index) {
      (async () => {
        const browser = await puppeteer.launch({
          args: ['--no-sandbox']
        });
        const url = "https://www.linkedin.com/posts/eeromartela_digimyynti-digitalsales-digimarkkinointi-activity-6675997627793985537-YlDI/";
        const page = await browser.newPage();
        await page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36");
        await page.waitFor(3534);
        await page.goto(`https://www.linkedin.com/uas/login?session_redirect=${req.query.url}`);
        await page.waitFor(3534);
        await page.focus('#username');
        await page.keyboard.type(user.username);
        await page.waitFor(394);
        await page.focus('#password')
        await page.keyboard.type(user.password);
        await page.waitFor(513);
        await page.click('button[type="submit"]');
        await page.waitFor(5000);
        const loc = await page.evaluate(() => {return location.href });
        await page.waitFor(5000);
        if (await page.$('button[aria-pressed="false"][aria-label^="Like"][aria-label$="post"]') !== null){
          await page.click('button[aria-pressed="false"][aria-label^="Like"][aria-label$="post"]');
          await page.waitFor(1033);
          response += `<code>liked by ${user.username}</code>`;
          res.send(`<h1>liked</h1><br><a href="${loc}">post</a>`);
          await browser.close();
        }else{
          res.send(`<h1>already liked</h1><br><a href="${loc}">post</a>`);
          await browser.close();
        }
        //await page.click('.share-reshare-button button');
        //await page.waitFor(853);
        //await page.click('button[data-control-name="share.post"]');
        //await page.waitFor(250000);
      })();
    });
    */  
  }else{
    res.send('no url');
  }

});


app.listen(port, () => console.log(`Example app listening on port ${port}!`));