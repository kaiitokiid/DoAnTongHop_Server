const express = require('express');
const app = express();
const port = process.env.port || 5000;
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(cors({
  credentials: true,
  // origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002']
  origin: "*"
}));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));
// parse application/json
app.use(bodyParser.json({ limit: '50mb' }));
// HTTP logger - terminal
app.use(morgan('combined'));

const db = require('./config/db');

// Connect to db
db.connect();

// Cấu hình static folder public
app.use(express.static(path.join(__dirname, 'public')));

// Routes init
const route = require('./app/routes');
route(app);

app.listen(port, () => {
  console.log(`App app listening at http://localhost:${port}`);
});