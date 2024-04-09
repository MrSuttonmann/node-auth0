import { version } from './version.js';
import { process } from 'node:process';

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
