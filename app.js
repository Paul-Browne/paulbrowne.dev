var ip = require('ip');
const puppeteer = require("puppeteer");
const express = require('express');
const app = express();
const port = 3000;

const publicIp = require('public-ip');

// serve public from root
app.use('/', express.static('public'));


app.use('/tester', function(req, res){
  (async () => {
    var one = await publicIp.v4();
    var two = await ip.address();
    await res.send(`<pre>${one}</pre><pre>${two}</pre>`);
})();
})

const credentials = [
  {
    username: "paulmatthewbrowne@gmail.com",
    password: ":$q7*UfRUQ$i*Hj"
  }
];

app.use('/like-my-post', function(req, res){
  if(req.query.url){
    res.send(`<a target="_blank" href="${req.query.url}">liking this post...<a><br><span>wait a minute</span>`);
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
        await res.write(loc);
        await page.waitFor(5000);
        if (await page.$('button[aria-pressed="false"][aria-label^="Like"][aria-label$="post"]') !== null){
          await page.click('button[aria-pressed="false"][aria-label^="Like"][aria-label$="post"]');
          await page.waitFor(1033);
          await res.write("<h1>liked</h1>");
          await res.end();
          await browser.close();
        }else{
          await res.write("<h1>already liked</h1>");
          await res.end();
          await browser.close();
        }
        //await page.click('.share-reshare-button button');
        //await page.waitFor(853);
        //await page.click('button[data-control-name="share.post"]');
        //await page.waitFor(250000);
      })();
    });  
  }else{
    res.send('no url');
  }

});


app.listen(port, () => console.log(`Example app listening on port ${port}!`));