'use strict';
const expect = require('chai').expect;
const request = require('supertest');
const app = require('../app');

const sort = ['App', 'Rating'];
const genres = ['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card'];

describe('GET /apps', () => {
  it('should be an array of apps', () => {
    return request(app)
      .get('/apps')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        const googleApp = res.body[0];
        expect(res.body).to.be.an('array');
        expect(res.body).to.have.lengthOf.at.least(1);
        expect(googleApp).to.include.all.keys([
          'App',
          'Genres',
          'Rating',
          'Category'
        ]);
      });
  });
  it('should return 400 error if sort doesnt exist', () => {
    return request(app)
      .get('/apps')
      .query({ sort: 'NoSort' })
      .expect(400);
  });
  it('should return 400 error if genre doesnt exist', () => {
    return request(app)
      .get('/apps')
      .query({ genres: 'NoGenre' })
      .expect(400);
  });
  it('should return selected genre', () => {
    const genreChoice = genres.map(genre => {
      return request(app)
        .get('/apps')
        .query({ genres: genre })
        .expect(200)
        .expect('Content-Type', /json/)
        .then(res => {
          const filteredApps = res.body;
          let filtered = true;
          filteredApps.forEach(app => {
            filtered = app.Genres.includes(genre);
          });
          expect(filtered).to.be.true;
        });
    });
    return Promise.all(genreChoice);
  });
  it('should sort by rating', () => {
    return request(app)
      .get('/apps')
      .query({ sort: 'Rating' })
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        const apps = res.body;
        let sorted = true;
        for (let i = 0; i < apps.length - 1; i += 1) {
          const currentApp = apps[i];
          const nextApp = apps[i + 1];
          sorted = currentApp.Rating >= nextApp.Rating;
          if(!sorted) break;
        }
        expect(sorted).to.be.true;
      });
  });
  it('should sort by app', () => {
    return request(app)
      .get('/apps')
      .query({ sort: 'App' })
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        const apps = res.body;
        let sorted = true;
        for (let i = 1; i < apps.length -1; i += 1) {
          const currentApp = apps[i];
          const nextApp = apps[i + 1];
          sorted = currentApp.App < nextApp.App;
          if (!sorted) break;
        }
        expect(sorted).to.be.true;
      });
  });
});