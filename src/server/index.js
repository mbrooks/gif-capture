const express = require('express');
const path = require('path');
const morgan = require('morgan');
const config = require('config');

const app = express();

app.use(morgan('combined'));

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '/views'));

app.use(express.static(path.join(__dirname, '/public')));
app.get('/', (req, res) => {
  res.render('index');
});
app.get('/view/:imageId', (req, res) => {
  const { imageId } = req.params;
  res.render('index', { imageId });
});
app.listen(config.server.port, () => console.log(`Listening on port ${config.server.port}!`));
