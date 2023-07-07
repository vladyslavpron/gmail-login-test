const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

const { GmailParser } = require("./GmailParser");

const email = "example@gmail.com";
const password = "password";

(async () => {
  const browser = await GmailParser.createBrowser();
  const gmailParser = new GmailParser(browser);
  await gmailParser.init();

  await gmailParser.login({ email, password });

  const count = await gmailParser.getUnreadMessagesCount();
  console.log("Unread messages count: ", count);

  await gmailParser.destroy();
})();
