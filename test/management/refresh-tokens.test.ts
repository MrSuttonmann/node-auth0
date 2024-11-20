import nock from 'nock';

const API_URL = 'https://tenant.auth0.com/api/v2';

import { RefreshTokensManager, ManagementClient } from '../../src/index.js';

describe('RefreshTokensManager', () => {
  let refreshTokens: RefreshTokensManager;
  const token = 'TOKEN';

  beforeAll(() => {
    const client = new ManagementClient({
      domain: 'tenant.auth0.com',
      token: token,
    });
    refreshTokens = client.refreshTokens;
  });

  describe('#constructor', () => {
    it('should throw an error when no base URL is provided', () => {
      expect(() => {
        new RefreshTokensManager({} as any);
      }).toThrowError(Error);
    });

    it('should throw an error when the base URL is invalid', () => {
      expect(() => {
        new RefreshTokensManager({ baseUrl: '' } as any);
      }).toThrowError(Error);
    });
  });

  describe('#get', () => {
    let request: nock.Scope;
    const id = '1';

    beforeEach(() => {
      request = nock(API_URL).get(`/refresh-tokens/${id}`).reply(200, {});
    });

    it('should return a promise if no callback is given', (done) => {
      refreshTokens.get({ id }).then(done.bind(null, null)).catch(done.bind(null, null));
    });

    it('should pass any errors to the promise catch handler', (done) => {
      nock.cleanAll();

      nock(API_URL).get(`/refresh-tokens/${id}`).reply(500);

      refreshTokens.get({ id: id }).catch((err) => {
        expect(err).toBeDefined();
        done();
      });
    });

    it('should pass the body of the response to the "then" handler', (done) => {
      nock.cleanAll();

      const data = { id: '1' };
      nock(API_URL).get(`/refresh-tokens/${id}`).reply(200, data);

      refreshTokens.get({ id: id }).then((refreshToken) => {
        expect(refreshToken.data.id).toBe(data.id);

        done();
      });
    });

    it('should perform a GET request to /api/v2/refresh-tokens', (done) => {
      refreshTokens.get({ id: id }).then(() => {
        expect(request.isDone()).toBe(true);

        done();
      });
    });

    it('should include the token in the Authorization header', (done) => {
      nock.cleanAll();

      const request = nock(API_URL)
        .get(`/refresh-tokens/${id}`)
        .matchHeader('Authorization', `Bearer ${token}`)
        .reply(200, {});

      refreshTokens.get({ id: id }).then(() => {
        expect(request.isDone()).toBe(true);
        done();
      });
    });
  });

  describe('#delete', () => {
    const id = '5';

    let request: nock.Scope;

    beforeEach(() => {
      request = nock(API_URL).delete(`/refresh-tokens/${id}`).reply(200, {});
    });

    it('should return a promise when no callback is given', (done) => {
      refreshTokens.delete({ id }).then(done.bind(null, null));
    });

    it(`should perform a delete request to /refresh-tokens/${id}`, (done) => {
      refreshTokens.delete({ id }).then(() => {
        expect(request.isDone()).toBe(true);

        done();
      });
    });

    it('should pass any errors to the promise catch handler', (done) => {
      nock.cleanAll();

      nock(API_URL).delete(`/refresh-tokens/${id}`).reply(500, {});

      refreshTokens.delete({ id }).catch((err) => {
        expect(err).toBeDefined();

        done();
      });
    });

    it('should include the token in the authorization header', (done) => {
      nock.cleanAll();

      const request = nock(API_URL)
        .delete(`/refresh-tokens/${id}`)
        .matchHeader('authorization', `Bearer ${token}`)
        .reply(200, {});

      refreshTokens.delete({ id }).then(() => {
        expect(request.isDone()).toBe(true);

        done();
      });
    });
  });
});
