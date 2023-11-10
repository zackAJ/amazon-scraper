const axios = require("axios");
const cheerio = require("cheerio");
const TARGET_URL = "https://www.amazon.com/";
const QUERY_URL = "https://www.amazon.com/s?k=";

const PRODUCTION_HEADERS = {
	headers: {
		authority: "www.amazon.com",
		accept:
			"text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
		"accept-language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
		"cache-control": "max-age=0",
		cookie:
			"visitId=1657611082733-168489653; _gcl_au=1.1.1398385248.1657611083; _hjid=fd384eba-6c16-4f90-9c7e-c7d4ace2ce9f; _hjSessionUser_1719103=eyJpZCI6IjYwMDdhZGUzLWU1OWMtNTcwYi04ZjI1LWY3Y2FhM2I3YjI2MiIsImNyZWF0ZWQiOjE2NTc2MTEwODMzNjcsImV4aXN0aW5nIjp0cnVlfQ==; mics_uaid=web:1056:12cd1f14-72d4-4c0a-ae93-1e85e3591fc4; uid=12cd1f14-72d4-4c0a-ae93-1e85e3591fc4; mics_vid=28049671765; ABTasty=uid=wa8jg07q9m8gza0z&fst=1657611082763&pst=-1&cst=1657611082763&ns=1&pvt=4&pvis=4&th=; _ga_P0TGS7TPQ7=GS1.1.1657611082.1.1.1657612394.0; sl-pdd_LD_UserId=a4ffa357-d994-44ef-b211-9be3bae4e28c; sl-pdd.abtest.ali-ab-test=Prod; sl-pdd.abtest.c2C-block-redesign=control; sl-pdd.abtest.contact-form-ab-test=Prod; sl-pdd.abtest.enhance-map-ab-test=Excluded; sl-pdd.abtest.lead-phone-ab-test=PageVariante; sl-pdd.abtest.multivariate-test=b; sl-pdd.abtest.slider-ab-test=Excluded; sl-pdd.abtest.street-view-ab-test=Excluded; sl-pdd.abtest.tenant-file-redesign-v2=V2-reference; atuserid=%7B%22name%22%3A%22atuserid%22%2C%22val%22%3A%22701f22cd-2a06-47c6-b632-aa089014ecfb%22%2C%22options%22%3A%7B%22end%22%3A%222023-09-04T08%3A52%3A21.103Z%22%2C%22path%22%3A%22%2F%22%7D%7D; _hjSessionUser_736989=eyJpZCI6IjhjOTQ1ZTdjLWQ1MTctNTY3MC05YzI2LTNjMTkxZGJkMGYxNiIsImNyZWF0ZWQiOjE2NTk1MTY3NDI1NDksImV4aXN0aW5nIjp0cnVlfQ==; mics_vid=28049671765; ry_ry-s3oa268o_realytics=eyJpZCI6InJ5X0IxOENEMkI0LTQ4ODYtNDg1Mi05MDdBLTEwNzg1MTQxNkRCMCIsImNpZCI6bnVsbCwiZXhwIjoxNjkxMDUyNzQxODMyLCJjcyI6MX0%3D; didomi_token=eyJ1c2VyX2lkIjoiMTdhNTMyZGEtMjUzMS02MDM2LWJlMTQtYmFmYTQyOTg1YWNjIiwiY3JlYXRlZCI6IjIwMjItMDgtMTFUMTA6MDU6MjAuOTc2WiIsInVwZGF0ZWQiOiIyMDIyLTA4LTExVDEwOjA1OjIwLjk3NloiLCJ2ZW5kb3JzIjp7ImVuYWJsZWQiOlsiZ29vZ2xlIiwiYzphZHNjYWxlIiwiYzpmaXJlYmFzZS03OGROS0NGOSIsImM6YmluZy1hZHMiLCJjOmRpZG9taSIsImM6YWNjZW5nYWdlLUU3TGhSTEhRIiwiYzphZHZlcnRpc2luZ2NvbSIsImM6eWFob28tYWQtZXhjaGFuZ2UiLCJjOnlhaG9vLWFuYWx5dGljcyIsImM6eW91dHViZSIsImM6aG90amFyIiwiYzpvbW5pdHVyZS1hZG9iZS1hbmFseXRpY3MiLCJjOmNsb3VkLW1lZGlhIiwiYzphZHN0aXIiLCJjOmFkaW5nbyIsImM6YWNjZW5nYWdlIiwiYzppdmlkZW5jZSIsImM6aGFydmVzdC1QVlRUdFVQOCIsImM6Z29vZ2xlYW5hLTRUWG5KaWdSIiwiYzpzbm93cGxvdy1MclJxaDlxSiIsImM6YmF0Y2gtSEZQRkZGTmMiLCJjOmFwcHNmbHllci1CeWh3ZVZjYiIsImM6YWlyc2hpcC1qUTJ0YmlKZSIsImM6bGF1bmNoZGFyLThxYThRanQ3Il19LCJwdXJwb3NlcyI6eyJlbmFibGVkIjpbImFuYWx5c2VkZS1WRFRVVWhuNiIsImF1ZGllbmNlIiwicHVycG9zZV9hbmFseXRpY3MiLCJkZXZpY2VfY2hhcmFjdGVyaXN0aWNzIiwiZ2VvbG9jYXRpb25fZGF0YSJdfSwidmVuZG9yc19saSI6eyJlbmFibGVkIjpbImdvb2dsZSIsImM6bGF1bmNoZGFyLThxYThRanQ3Il19LCJwdXJwb3Nlc19saSI6eyJlbmFibGVkIjpbImFuYWx5c2VkZS1WRFRVVWhuNiJdfSwidmVyc2lvbiI6MiwiYWMiOiJDZ2VBV0FGa0Fvd0J1QUVUQUpBQVNXQkVrQ1g0RmlBUU1Bb0guQ2dlQVVBVVlBM0FDSmdFZ0FKTEFpU0JMOEN4QUlHQVVEZ0FBIn0=; euconsent-v2=CPdisEAPdisEAAHABBENCbCsAP_AAH_AAAAAIAwMgAFAANAAqABcADgAIAAVAAtABkADSAIoAjABMgCeAKAAUoAsgC2AF4AMIAZgA5gCAgEGAQgAjABHACUgEuATEApAClAFaALgAZYA8gB-gEDAIKAQeAjgCOgE8ALMAYEA0AB1AD9AH_ARqAj0BL4CjwF5gNaAeYBAEEAYDoAFQALgAcABAADIAGgARQAmQBPAFAAKQAZgA5gCEAEdAJcAmABSgDLAH6AQMAgoBBwCLQEcAR0AwIB1AD_gI9AXmBAEAAAA.f_gAD_gAAAAA; realytics=1; _hjDonePolls=816466; mics_lts=1661695183442; mics_lts=1661958151059; datadome=63Isub0xN.YMWvZ-eAtujfObUSi_d0GOFbk0CHJdk04QDiqYSsGvn_SD~~fs6JcVRFuL2bummFzV~YqxHiO0-L5SiiXvUAhuEIcyeSTDqQdifnf7RyrQc4q5rWtq91-; _ga_MC53H9VE57=GS1.1.1662134615.21.0.1662134615.0.0.0; _ga=GA1.2.418942909.1657611083; _gid=GA1.2.787398349.1662134616; _gat_tracker_pageview=1; ry_ry-s3oa268o_so_realytics=eyJpZCI6InJ5X0IxOENEMkI0LTQ4ODYtNDg1Mi05MDdBLTEwNzg1MTQxNkRCMCIsImNpZCI6bnVsbCwib3JpZ2luIjp0cnVlLCJyZWYiOm51bGwsImNvbnQiOm51bGwsIm5zIjpmYWxzZX0%3D; cto_bundle=l_qZN182RUxOMnYxWXVjeVBNJTJCNWJyeGdyJTJCN1k3V2dxYWpBWGFNNnlWZGYzQUp4WUlMS2tTUm9wbUEwVHoxR3JIdXklMkIyR3Rnd3I5aTJZZlBVQ2ZSTkRDczZ2dTlad3hBRThUZXo2cFhMZUQ3Qjh4JTJCOGdjWm1pdGhYZnBTN2lNeW5hWWY2TFRwOExyTm5HcHdBYzhsckhhaGNNRTZTaTZLcGxPWHpybVZsRng4NTI2WGJ3cGw0MHNqeXhEalVGR1clMkJKb3MlMkY; _hjIncludedInSessionSample=0; _hjSession_736989=eyJpZCI6IjZlMTQ3YTYyLWMyOTMtNDY0OC1iOWVhLTM4NzY3NzVjOTI2OSIsImNyZWF0ZWQiOjE2NjIxMzQ2MTY0MzgsImluU2FtcGxlIjpmYWxzZX0=; _hjAbsoluteSessionInProgress=0; _hjCachedUserAttributes=eyJhdHRyaWJ1dGVzIjp7fSwidXNlcklkIjpudWxsfQ==",
		"sec-ch-device-memory": "8",
		"sec-ch-ua":
			'"Google Chrome";v="105", "Not)A;Brand";v="8", "Chromium";v="105"',
		"sec-ch-ua-arch": '"arm"',
		"sec-ch-ua-full-version-list":
			'"Google Chrome";v="105.0.5195.52", "Not)A;Brand";v="8.0.0.0", "Chromium";v="105.0.5195.52"',
		"sec-ch-ua-mobile": "?0",
		"sec-ch-ua-model": '""',
		"sec-ch-ua-platform": '"macOS"',
		"sec-fetch-dest": "document",
		"sec-fetch-mode": "navigate",
		"sec-fetch-site": "none",
		"sec-fetch-user": "?1",
		"upgrade-insecure-requests": "1",
		"user-agent":
			"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
	},
};

const LOCAL_HEADERS = {
	headers: {
		"User-Agent":
			"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.90 Safari/537.36",
	},
};

const SELECTORS = {
	//after inspecting the page
	products: "[data-component-type=s-search-result]",
	title:
		"a.a-link-normal.s-underline-text.s-underline-link-text.s-link-style.a-text-normal span.a-color-base.a-text-normal", //this was the hardest to get, the classes are dynamic
	rating: "span.a-icon-alt",
	reviews: "span.a-size-base.s-underline-text",
  image: "img.s-image",
  link: "a:first"
};

const HEADERS =
  process.env.APP_ENV == "prod" ? PRODUCTION_HEADERS : LOCAL_HEADERS;
async function fetchAmazonPage(keyword) {
	try {
		let res = await axios.get(QUERY_URL + keyword, HEADERS);
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
			title: $(productDiv).find(SELECTORS.title).text(),

			rating: $(productDiv).find(SELECTORS.rating).text(),

			reviews: $(productDiv).find(SELECTORS.reviews).text(),

      image: $(productDiv).find(SELECTORS.image).attr("src"),
      
			link: TARGET_URL+ $(productDiv).find(SELECTORS.link).attr("href"),
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
