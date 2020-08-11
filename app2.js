// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality
const puppeteer = require('puppeteer-extra');

// add recaptcha plugin and provide it your 2captcha token (= their apiKey)
// 2captcha is the builtin solution provider but others would work as well.
// Please note: You need to add funds to your 2captcha account for this to work
const RecaptchaPlugin = require('puppeteer-extra-plugin-recaptcha');
puppeteer.use(
  RecaptchaPlugin({
    provider: {
      id: '2captcha',
      token: 'cf2f180a51ab9da985b39e4d09a19b11'
    },
    visualFeedback: true // colorize reCAPTCHAs (violet = detected, green = solved)
  })
)

// puppeteer usage as normal
puppeteer.launch({ headless: false }).then(async browser => {
  const page = await browser.newPage()
  await page.goto('https://www.google.com/recaptcha/api2/demo')

  // That's it, a single line of code to solve reCAPTCHAs 🎉
  await page.solveRecaptchas()

  await Promise.all([
    page.waitForNavigation(),
    page.click(`#recaptcha-demo-submit`)
  ])
  await page.screenshot({ path: 'response.png', fullPage: true })
  await browser.close()
})