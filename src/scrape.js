const axios = require("axios");
const cheerio = require("cheerio");
const URL = "https://www.amazon.com/s?k=";
const options = {
	headers: {
		Host: "www.amazon.com",
		"User-Agent":
			"Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:70.0) Gecko/20100101 Firefox/70.0",
		Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
		"Accept-Language": "en-US,en;q=0.5",
		"Accept-Encoding": "gzip, deflate, br",
		Connection: "keep-alive",
		"Upgrade-Insecure-Requests": "1",
		TE: "Trailers",
	},
};
const SELECTORS = {//after inspecting the page
	products: "[data-component-type=s-search-result]",
	title: "a.a-link-normal.s-underline-text.s-underline-link-text.s-link-style.a-text-normal span.a-color-base.a-text-normal",//this was the hardest to get, the classes are dynamic
	rating: "span.a-icon-alt",
	reviews: "span.a-size-base.s-underline-text",
	image: "img.s-image",
};


async function fetchAmazonPage(keyword) {
	try {
		let res = await axios.get(URL + keyword, options);
		return res; //return false to test amazon error response
	} catch (err) {
		console.log(err);
		return false;
	}
}

function constructProducts($, productDivs) {
	//I searched the classes inside the results card only to avoid any impostor data
	const products = [];
	productDivs.each((index, productDiv) => {
		products[index] = {
			title: $(productDiv).find($(SELECTORS.title)).text(),

			rating: $(productDiv).find($(SELECTORS.rating)).text(),

			reviews: $(productDiv).find($(SELECTORS.reviews)).text(),

			image: $(productDiv).find($(SELECTORS.image)).attr("src"),
		};
	});
	return products;
}

async function scrapeAmazon(keyword) {
  let products=false;//just to be sure
  await fetchAmazonPage(keyword).then((response) => {
		if (!(response.status >= 200 && response.status < 300)) return false; //test this by returning false in fetchAmazonPage()

		const $ = cheerio.load(response.data);//load whole page

		const productDivs = $(SELECTORS.products); //get productDivs

		products = constructProducts($, productDivs); //construct the data
	});

  return products; //returning the data
}

module.exports = scrapeAmazon;
