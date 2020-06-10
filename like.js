var credentials = [
	{
		username: "paulmatthewbrowne@gmail.com",
		password: ":$q7*UfRUQ$i*Hj"
	}
];

const puppeteer = require("puppeteer");
const express = require('express');

const app = express();
const port = 8888;

async function puppet(user, url, res){
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`https://www.linkedin.com/uas/login?session_redirect=${url}`);
  await page.waitFor(3534);
  await page.focus('#username')
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
    res.write(`<br/><br/><a href="${url}">post liked<a>`);
    res.end();
  	await browser.close();
  }else{
    res.write(`<br/><br/><a href="${url}">post was already liked<a>`);
    res.end();
  	await browser.close();
  }
  //await page.click('.share-reshare-button button');
  //await page.waitFor(853);
  //await page.click('button[data-control-name="share.post"]');
  //await page.waitFor(250000);
};

app.get('/like-my-post', function(req, res){
	if(req.query.url){
		res.write(`<a target="_blank" href="${req.query.url}">liking this post... wait a minute<a>`);
		credentials.forEach( function(user, index) {
			puppet(user, req.query.url, res);
		});		
	}else{
		res.send('no url');		
	}
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));