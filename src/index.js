import fetch from 'node-fetch'; //fetch allows us to work with http requests and responses
import cheerio from 'cheerio'; // allows use to parse html and work with it using queries
import promptSync from 'prompt-sync'; // allows for input from node console

const maxURLs = 100;
let crawlCount = 0;
// taking input URL
const prompt = promptSync();
const inputURL = prompt("Enter a URL:");

const seenURLs = {};
function getRealURL(link){
  if (link.startsWith('http')){
    return link; // case where href attributes do include the full url - just return the link
  }else if (link.startsWith("/")){
    return `${inputURL}${link}` // case where the link begins with /, don't need an extra /
  }else{
    return `${inputURL}/${link}` // case where the link does not begin with / - add it
  }
}

// fetch returns a promise that resolves with a Response object
// therefore we can use an async/await function that can wait until the request completes
async function crawl(url){
  // do not repeat seen URLs:
  if (seenURLs[url]) return;
  seenURLs[url] = true;

  crawlCount += 1; // keeping track number of recursive crawls
  console.log(crawlCount,":",url);

  // dealing with fetch callback:
  const response = await fetch(url);
  const html = await response.text();

  // from the list of a tags, get each href attribute links
  const $ = cheerio.load(html);
  const links = $('a').map((i, link) => link.attribs.href).get();

  // multiple recursion, (DFS)
  links.forEach((link) => {
    if (crawlCount < 100){
      crawl(getRealURL(link));
    }else{
      return;
    }
  }
  );
}

crawl(inputURL);