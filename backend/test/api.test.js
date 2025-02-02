import supertest from 'supertest';
import { expect } from 'chai';
import app from '../index.js';

const requestWithSupertest = supertest(app);

describe('Testing GET /movies endpoint', function () {
    it('responds with a valid HTTP status code and number of movies',
      async function () {
        const DEFAULT_MOVIES_PER_PAGE = 20;
        const response = await requestWithSupertest.get('/api/v1/movies');

        expect(response.status).to.equal(200);
        expect(response.body.movies.length).to.equal(DEFAULT_MOVIES_PER_PAGE);
      });
});

describe('Testing GET /movies/id/:id endpoint', function () {
  it('responds with a valid HTTP status code and response body',
  async function () {
    // This is the ID number of the movie 'Blacksmith Scene'
    const response = await requestWithSupertest.get(
      '/api/v1/movies/id/573a1390f29313caabcd4135'
      );
    expect(response.status).to.equal(200);
    expect(response.body.title).to.equal('Blacksmith Scene');
  });
});

describe('Testing GET /movies/ratings endpoint', function () {
  it('responds with a valid HTTP status code and ratings',
  async function () {
    const response = await requestWithSupertest.get('/api/v1/movies/ratings');
    expect(response.status).to.equal(200);
    // There should be 21 ratings, and the first is 'AO'
    expect(response.body[0]).to.equal('AO');
    expect(response.body.length).to.equal(21);
  });
});

describe('Testing POST /reviews endpoint', function () {
  it('responds with a valid HTTP status code and number of movies', async function () {
    const req_body = {
      "movie_id": "573a1390f29313caabcd4135",
      "review": "This is a TEST review",
      "user_id": "1234",
      "name": "Testy Testerson"
    }
    const response = await requestWithSupertest.post('/api/v1/movies/review')
                                               .send(req_body);

    expect(response.status).to.equal(200);
    expect(response.body.status).to.equal('success');

    // Delete the review we just created
    const del_body = {
      "review_id": response.body.response.insertedId,
    }
    await requestWithSupertest.delete('/api/v1/movies/review')
                                .send(del_body);
  });
});

describe('Testing PUT /reviews endpoint', function () {
  it('fails to update a review with the wrong user ID', async function () {
    // Create a review
    const req_body = {
      "movie_id": "573a1390f29313caabcd4135",
      "review": "This is a TEST review",
      "user_id": "1234",
      "name": "Testy Testerson"
    }
    const response = await requestWithSupertest.post('/api/v1/movies/review')
                                               .send(req_body);

    // Try to update the review with a different user ID
    const update_body = {
      "review_id": response.body.response.insertedId,
      "review": "This is an UPDATED TEST review",
      "user_id": "1235" // This should fail
    }
    const update_response = await requestWithSupertest.put('/api/v1/movies/review')
                                                      .send(update_body);
    expect(update_response.status).not.to.equal(200);
    expect(update_response.body.status).not.to.equal('success');

    // Delete the review we just created
    const del_body = {
      "review_id": response.body.response.insertedId,
    }
    await requestWithSupertest.delete('/api/v1/movies/review')
                                .send(del_body);
  });

  it('succeeds in updating a review with the correct user ID', async function () {
    // Create a review
    const req_body = {
      "movie_id": "573a1390f29313caabcd4135",
      "review": "This is a TEST review",
      "user_id": "1234",
      "name": "Testy Testerson"
    }
    const response = await requestWithSupertest.post('/api/v1/movies/review')
                                               .send(req_body);

    // Try to update the review with the correct user ID
    const update_body = {
      "review_id": response.body.response.insertedId,
      "review": "This is an UPDATED TEST review",
      "user_id": "1234" // This should be the same as the original user_id
    }
    const update_response = await requestWithSupertest.put('/api/v1/movies/review')
                                                      .send(update_body);
    expect(update_response.status).to.equal(200);
    expect(update_response.body.status).to.equal('success');

    // Delete the review we just created
    const del_body = {
      "review_id": response.body.response.insertedId,
    }
    await requestWithSupertest.delete('/api/v1/movies/review')
                                .send(del_body);
  });
});

describe('Testing DELETE /reviews endpoint', function () {
  // This test is a bit redundant, but it's here for completeness
  // The POST test already deletes the review it creates
  // This test is here to make sure that the DELETE endpoint works
  // as expected

  it('responds with a valid HTTP status code', async function () {
    const req_body = {
      "movie_id": "573a1390f29313caabcd4135",
      "review": "This is a TEST review",
      "user_id": "1234",
      "name": "Testy Testerson"
    }
    const response = await requestWithSupertest.post('/api/v1/movies/review')
                                               .send(req_body);

    const del_body = {
      "review_id": response.body.response.insertedId,
    }
    const del_response = await requestWithSupertest.delete('/api/v1/movies/review')
                                                    .send(del_body);

    expect(del_response.status).to.equal(200);
    expect(del_response.body.status).to.equal('success');
  });
});
