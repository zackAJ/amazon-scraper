var express = require("express");
const scrapeAmazon = require("../src/scrape.js");
var validator = require("validator");

var router = express.Router();

router.get("/", function (req, res, next) {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

router.get("/api/scrape", async function (req, res, next) {
  const keyword = validator.escape(''+req.query.keyword).trim(); //cleaning input
  if (!keyword)//handling empty strings
			return res
			.status(400)
			.json(
				"keyword query string required, example query: /api/scrape?keyword=hat"
			);

  scrapeAmazon(keyword).then((products) => {
    if (!products) //ajax to amazon went wrong= falsy
     	return res
        .status(400)
        .json(
          "something went wrong when scraping Amazon, contact the developer."
        );

    res.json({//returning the data
      keyword,
      products_count: products.length,
      products,
    });
  });
});

module.exports = router;
