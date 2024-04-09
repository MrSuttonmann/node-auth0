import { version } from './version.js';

/**
 * @private
 */
export const generateClientInfo = () => ({
  name: 'node-auth0',
  version: version,
  env: {
    node: 'cloudflare-workers',
  },
});
