const childProcess = require('child_process');

const puppeteer = require("puppeteer");
const express = require('express');
const app = express();
const port = 3000;

// serve public from root
app.use('/', express.static('public'));

const credentials = [
  {
    username: "paulmatthewbrowne@gmail.com",
    password: ":$q7*UfRUQ$i*Hj"
  }
];


function runScript(scriptPath, callback) {

    // keep track of whether callback has been invoked to prevent multiple invocations
    var invoked = false;

    var process = childProcess.fork(scriptPath);

    // listen for errors as they may prevent the exit event from firing
    process.on('error', function (err) {
        if (invoked) return;
        invoked = true;
        callback(err);
    });

    // execute the callback once the process has finished running
    process.on('exit', function (code) {
        if (invoked) return;
        invoked = true;
        var err = code === 0 ? null : new Error('exit code ' + code);
        callback(err);
    });

}

app.use('/like-my-post', function(req, res){
  runScript('./test.js', function (err) {
      if (err) throw err;
      console.log('finished running some-script.js');
  });

  /*
  if(req.query.url){
    res.write(`<a target="_blank" href="${req.query.url}">liking this post...<a><br><span>wait a minute</span>`);

    credentials.forEach( function(user, index) {
      (async () => {
        const browser = await puppeteer.launch({
          args: ['--no-sandbox']
        });
        await res.write("<p>1</p>");
        const url = "https://www.linkedin.com/posts/eeromartela_digimyynti-digitalsales-digimarkkinointi-activity-6675997627793985537-YlDI/";
        const page = await browser.newPage();
        await page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36");
        await res.write("<p>2</p>");
        await page.waitFor(3534);
        await page.goto(`https://www.linkedin.com/uas/login?session_redirect=${req.query.url}`);
        await res.write("<p>3</p>");
        await page.waitFor(3534);
        await page.focus('#username');
        await page.keyboard.type(user.username);
        await res.write("<p>4</p>");
        await page.waitFor(394);
        await page.focus('#password')
        await res.write("<p>5</p>");
        await page.keyboard.type(user.password);
        await page.waitFor(513);
        await res.write("<p>6</p>");
        await page.click('button[type="submit"]');
        await page.waitFor(5000);
        await res.write("<p>7</p>");
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


    // credentials.forEach( function(user, index) {
    //   (async () => {
    //     await res.write(`<p>1</p>`);
    //     const browser = await puppeteer.launch({
    //       args: ['--no-sandbox']
    //     });
    //     await res.write(`<p>2</p>`);
    //     const page = await browser.newPage();
    //     await res.write(`<p>3</p>`);
    //     await page.goto(`https://www.linkedin.com/uas/login?session_redirect=${req.query.url}`);
    //     await res.write(`<p>4</p>`);
    //     await page.waitFor(3534);
    //     await res.write(`<p>5</p>`);
    //     await res.write(`<p>typing username</p>`);
    //     await page.focus('#username');
    //     await page.keyboard.type(user.username);
    //     await page.waitFor(394);
    //     await res.write(`<p>typing password</p>`);
    //     await page.focus('#password')
    //     await page.keyboard.type(user.password);
    //     await page.waitFor(513);
    //     await page.click('button[type="submit"]');
    //     await page.waitForNavigation();
    //     const loc2 = await page.evaluate(() => {return location.href });
    //     res.write(`<p>${loc2}</p>`);
    //     if (await page.$('button[aria-pressed="false"][aria-label^="Like"][aria-label$="post"]') !== null){
    //       await page.click('button[aria-pressed="false"][aria-label^="Like"][aria-label$="post"]');
    //       await page.waitFor(1033);
    //       res.write(`<br/><br/><a href="${req.query.url}">post liked<a>`);
    //       res.end();
    //       await browser.close();
    //     }else{
    //       res.write(`<br/><br/><a href="${req.query.url}">post was already liked<a>`);
    //       res.end();
    //       await browser.close();
    //     }
    //     //await page.click('.share-reshare-button button');
    //     //await page.waitFor(853);
    //     //await page.click('button[data-control-name="share.post"]');
    //     //await page.waitFor(250000);
    //   })();
    // });   
  }else{
    res.send('no url');
  }

  */

});


app.listen(port, () => console.log(`Example app listening on port ${port}!`));