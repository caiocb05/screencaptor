import puppeteer from 'puppeteer-core';
import express from 'express';

const app = express();
const port = process.env.PORT || 8080;

// Your routes will go here



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
    const browser = await puppeteer.launch({
      executablePath: '/usr/bin/chromium-browser', // Set your Chromium path
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

    // You can save the screenshot buffer to a file or send it as a response
    // For demonstration, let's send it as base64 data:
    //const base64Image = screenshotBuffer.toString('base64');
    //res.send(base64Image);

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
