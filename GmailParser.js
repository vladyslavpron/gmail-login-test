const puppeteer = require("puppeteer-extra");

class GmailParser {
  constructor(browser) {
    this.browser = browser;
  }

  static async createBrowser() {
    return puppeteer.launch({
      args: ["--no-sandbox"],
      headless: false,
    });
  }

  async init() {
    this.page = await this.browser.newPage();
    await this.page.setViewport({ width: 1080, height: 1024 });
  }

  async login({ email, password }) {
    await this.page.goto("https://mail.google.com/");

    const emailInputSelector = 'input[type="email"]';
    await this.page.waitForSelector(emailInputSelector, { visible: true });
    await this.page.click(emailInputSelector);
    await this.page.type(emailInputSelector, email);
    await this.page.click("#identifierNext");

    const passwordInputSelector = 'input[type="password"]';
    await this.page.waitForSelector(passwordInputSelector, {
      visible: true,
    });
    await this.page.click(passwordInputSelector);
    await this.page.type(passwordInputSelector, password);
    await this.page.waitForSelector("#passwordNext");
    await this.page.click("#passwordNext");
  }

  async getUnreadMessagesCount() {
    // Selector may be more simple and direct if we don't want to support multiple locales
    const inboxLinkSelector = 'a[href^="https://mail.google.com"][aria-label]';

    const inboxLink = await this.page.waitForSelector(inboxLinkSelector);

    const count = await inboxLink.evaluate((inboxLink) => {
      const countElement =
        inboxLink.parentElement.parentElement.querySelector("div");

      const countStringDirty = countElement ? countElement.textContent : "0";

      const countString = countStringDirty.replace(/[,.+-]/g, "");
      return Number(countString);
    });

    return count;
  }

  async destroy() {
    await this.browser.close();
  }
}

module.exports = {
  GmailParser,
};
