const express = require('express');
const { config } = require('./config/env');
const { connectAsPool } = require('./database/dbConnect/dbConnection');
const auth = require('./routes/auth');
const user = require('./routes/user');
const { errorHandler } = require('./middleware/errorHandling');
const cookieParser = require('cookie-parser');
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cookieParser());

connectAsPool();

app.use(auth);
app.use(user);

app.use((req, res) => {
  return res.status(404).json({
    success: false,
    error: {
      code: 404,
      message: 'Url Not Found.',
    },
  });
});

app.use(errorHandler);

const port = config.serverPort || 3000;
app.listen(port, () => {
  /* eslint-disable */
  console.log(`Server on http://localhost:${port}`);
});
