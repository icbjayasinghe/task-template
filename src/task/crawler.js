import PCR from "puppeteer-chromium-resolver";

export async function crawl(searchTerm) {
  const options = {};
  const stats = await PCR(options);
  // console.log(`Chrome Path: ${stats.executablePath}`);

  // Set up puppeteer
  // set headless = false for visualization debugging, set headless = true for production
  const browser = await stats.puppeteer.launch({
    headless: false,
    executablePath: process.env.CHROME_EXECUTABLE_PATH,
  });

  // Open a new page
  const page = await browser.newPage();
  // Set the user agent to a common browser user agent
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36"
  );
  // The URL to scrape
  const url = `https://forums.redflagdeals.com/hot-deals-f9/`;

  // `documentloaded` means the loading icon on the left of the tab is resolved
  await page.goto(url, { waitUntil: "domcontentloaded" });

  // Wait for the search bar to load
  await page.waitForSelector("#search_keywords");

  // type the search term into the search bar
  await page.type("#search_keywords", searchTerm);

  // submit the search term
  await page.keyboard.press("Enter");

  // await new Promise(r => setTimeout(r, 1000));
  await page.waitForSelector(".close");
  
  // Get the titles of the links
  let titles = null;
  try {
    titles = await page.$$eval("#search_results > ul.thread_list > li:nth-child(1) > div.thread_info > div > h2 > a", (links) =>
      links.map((link) => link.textContent.trim())
    );
  } catch (error) {
    console.log("Error:", error);
  }

  // close puppeteer
  await browser.close();

  return titles;
}
