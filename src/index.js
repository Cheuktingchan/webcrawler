import fetch from 'node-fetch'; //fetch allows us to work with http requests and responses
import cheerio from 'cheerio'; // allows use to parse html and work with it using queries

// fetch returns a promise that resolves with a Response object
// therefore we can use an async/await function that can wait until the request completes

const seenURLs = {};

function getRealURL(link){
  if (link.includes('http') !== -1){
    return link; // case where href attributes do include the full url - just return the link
  }else if (link.startsWith("/")){
    return `"https://news.ycombinator.com"${link}` // case where the link begins with /, don't need an extra /
  }else{
    return `"https://news.ycombinator.com"/${link}` // case where the link does not begin with / - add it
  }
}
async function crawl(url){

  // do not repeat seen URLs:
  if (seenURLs[url]) return;
  seenURLs[url] = true;
  
  // dealing with fetch callback:
  const response = await fetch(url);
  const html = await response.text();

  // from the list of a tags, get each href attribute links
  const $ = cheerio.load(html);
  const links = $('a').map((i, link) => link.attribs.href).get();

  // multiple recursion, (DFS)
  console.log(links);
  links.forEach((link) => {
    crawl(getRealURL(url))
  }
  );
}

crawl("https://news.ycombinator.com");