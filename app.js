const express = require('express');
const { errorHandling } = require(`./middleware/errorHandling`);
const { connectAsPool } = require('./database/dbConnect/dbConnection');
const { config } = require('./config/env');
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

connectAsPool();

app.use((req, res, next) => {
  return res.status(404).json({
    success: false,
    error: {
      code: 404,
      message: `Url Not Found.`,
    },
  });
});

app.use(errorHandling);

const port = config.serverPort || 3000;
app.listen(port, () => {
  console.log(`Server on http://localhost:${port}`);
});
