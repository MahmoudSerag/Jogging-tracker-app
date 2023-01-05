const express = require('express');
const cookieParser = require('cookie-parser');
const { config } = require('./config/env');
const { createDB } = require('./database/dbConnect/createDB');
const { createTables } = require('./database/dbConnect/createTables');
const { connectAsPool } = require('./database/dbConnect/dbConnection');
const { errorHandler } = require('./middleware/errorHandling');
const auth = require('./routes/auth');
const user = require('./routes/user');
const jogging = require('./routes/jogging');

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cookieParser());

(async () => {
  await createDB();
  await createTables();
  await connectAsPool();
})();

app.use(auth);
app.use(user);
app.use(jogging);

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
