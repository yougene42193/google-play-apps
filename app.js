'use strict';
const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(morgan('common'));

const playstore = require('./playstore.js');

app.get('/apps', (req, res) => {
  const { search = '', sort, genres } = req.query;

  if(sort) {
    if(!['Rating', 'App'].includes(sort)) {
      return res
        .status(400)
        .send('Please sort by Rating or App');
    }
  }

  if(genres) {
    if(!['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card'].includes(genres)) {
      return res
        .status(400)
        .send('Genres must be Action, Puzzle, Strategy, Casual, Arcade or Card');
    }
  }

  let results = playstore
    .filter(app => 
      app
        .App
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  if(sort) {
    results.sort((a, b) => {
      return a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0;
    });
  }
  if(genres) {
    results = results.filter(app => app.Genres.includes(genres));
  }
  res
    .json(results);
});

app.listen(8000, () => {
  console.log('Listening on port 8000');
});