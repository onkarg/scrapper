const express = require("express");

const scraper = require("./utils/scraper");
const app = express();

app.set("view engine", "pug");

app.get("/", (req, res) => {
  // const browser = await puppeteer.launch();
  // const page = await browser.newPage();
  // await page.goto('https://github.com/nauto/web-apps/commits/develop', {
  //   waitUntil: 'networkidle2',
  // });
  // const element = await page.$(
  //   '[class=Box-row Box-row--focus-gray mt-0 d-flex js-commits-list-item js-navigation-item js-details-container Details js-socket-channel js-updatable-content navigation-focus]'
  // );
  // console.log('element', element);
  // // await page.pdf({ path: 'hn.pdf', format: 'a4' });

  // await browser.close();
  const mediumArticles = new Promise((resolve, reject) => {
    scraper
      .scrapeMedium()
      .then((data) => {
        resolve(data);
      })
      .catch((err) => reject("Medium scrape failed"));
  });

  const youtubeVideos = new Promise((resolve, reject) => {
    scraper
      .scrapeYoutube()
      .then((data) => {
        resolve(data);
      })
      .catch((err) => reject("YouTube scrape failed"));
  });

  Promise.all([mediumArticles, youtubeVideos])
    .then((data) => {
      res.render("index", { data: { articles: data[0], videos: data[1] } });
    })
    .catch((err) => res.status(500).send(err));
});

app.listen(process.env.PORT || 3001);
