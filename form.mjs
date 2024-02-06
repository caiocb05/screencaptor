// @ts-check

export const form = async (req, res) => {
  res.send(`

    <html>
      <head>
        <title>Screencaptor</title>
        <style>body { font-family: sans-serif }</style>
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
}