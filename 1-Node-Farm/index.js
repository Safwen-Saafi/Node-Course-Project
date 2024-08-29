const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');
const replaceTemplate = require('./module/replaceTemplate'); // Ensure this function is correctly implemented

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data); // Array of product objects

// Create slugs for each product and map them to product indices
const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));
const slugToProduct = dataObj.reduce((acc, el, index) => {
  acc[slugs[index]] = index;
  return acc;
}, {});

//example for the slugToProduct array : if el.productName is "Fresh Avocados" and its index is 0, acc["fresh-avocados"] = 0.

//slugToProduct will be an object mapping slugs to their corresponding product indices. For example, {"fresh-avocados": 0, "organic-bananas": 1}.

//slugs will be an array of slugs corresponding to the product names in dataObj. For example, if dataObj contains products with names "Fresh Avocados" and "Organic Bananas", slugs will be ["fresh-avocados", "organic-bananas"].

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;
  console.log(`Requested URL: ${pathname}`); // Diagnostic log

  // Overview page
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    const cardsHtml = dataObj.map((el) => replaceTemplate(tempCard, el)).join('');
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
    res.end(output);

    // Product page with ID redirection
  } else if (pathname === '/product') {
    const productId = query.id;
    if (productId !== undefined && slugToProduct[slugs[productId]] !== undefined) {
      const newSlug = slugs[productId];
      res.writeHead(302, { Location: `/product/${newSlug}` });
      res.end();
      //Redirection: If the productId is valid, it redirects the request to the new URL format that uses the product's slug (e.g., /product/fresh-avocados).
    } else {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('<h1>Product not found!</h1>');
    }

    // Product page with slug
  } else if (pathname.startsWith('/product/')) {
    const slug = pathname.replace('/product/', '').toLowerCase();
    console.log(`Requested slug: ${slug}`); // Diagnostic log

    const productIndex = slugToProduct[slug];
    console.log(`Product index: ${productIndex}`); // Diagnostic log

    if (productIndex !== undefined) {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      const product = dataObj[productIndex];
      const output = replaceTemplate(tempProduct, product);
      res.end(output);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('<h1>Product not found!</h1>');
    }

    // API
  } else if (pathname === '/api') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(data);

    // Not found
  } else {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('<h1>Page not found!</h1>');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to requests on port 8000');
});
