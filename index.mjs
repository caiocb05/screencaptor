import os from 'os';
import puppeteer from 'puppeteer-core';
import express from 'express';

const app = express();
const port = process.env.PORT || 8080;

app.get('/', async (req, res) => {
  res.send(`

    <html>
      <head>
        <title>Screencaptor</title>
      </head>

      <body>
        <h1>Welcome to Screencaptor</h1>
        <form action="screenshot">
          <div>
            URL: <input name="url" value="https://github.com/caiocb05" type="text">
          </div>
	  <div>
	  Color: <input name="color" value="red" type="text">
	  </div>
          <input type="submit" value="Screencapture It!">
        </form>
      </body>
    </html>
  `);
});

app.get('/screenshot', async (req, res) => {
  const url = req.query.url; // Get the URL from the query string
  const color = req.query.color;

  try {

    let executablePath;

    switch (os.platform()) {
      case 'win32':
        // For Windows
        executablePath = '%ProgramFiles(x86)%\\Google\\Chrome\\Application\\chrome.exe';
        break;
      case 'darwin':
        // For macOS
        executablePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
        break;
      case 'linux':
        // For Linux
        executablePath = '/usr/bin/google-chrome-stable';
        break;
      default:
        console.log(`Unsupported platform: ${os.platform()}`);
        process.exit(1);
    }

    const browser = await puppeteer.launch({
      executablePath,
      // headless: false,
    });
    const page = await browser.newPage();

    await page.setViewport({
      width: 1920,
      height: 1080
    })

    await page.goto(url);

    //await page.waitForSelector('.avatar-user');


    const result = await page.evaluate((color) => {
      document.body.style.background = color || 'red';
      //document.querySelector('.avatar-user').style.filter = 'invert(1) !important';
    }, color);


    await page.waitForTimeout(1000);

    const screenshotBuffer = await page.screenshot({ omitBackground: true });

    res.setHeader('Content-Type', 'image/png'); // Set the appropriate content type
    res.send(screenshotBuffer);

    await browser.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    res.status(500).send('Error capturing screenshot');
  }
});

app.listen(port);
console.log(`Server started at http://localhost:${port}`);
