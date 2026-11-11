import assert from 'node:assert/strict';
import { test } from 'node:test';
import { proxyEnvironmentLines } from './session-env.mjs';

test('a session behind a proxy makes Node fetch use it, and one without a proxy changes nothing', () => {
  assert.deepEqual(proxyEnvironmentLines({ HTTPS_PROXY: 'http://127.0.0.1:3128' }), ['export NODE_USE_ENV_PROXY=1']);
  assert.deepEqual(proxyEnvironmentLines({ http_proxy: 'http://127.0.0.1:3128' }), ['export NODE_USE_ENV_PROXY=1']);
  assert.deepEqual(proxyEnvironmentLines({}), []);
  assert.deepEqual(proxyEnvironmentLines({ HTTPS_PROXY: '' }), []);
  // An existing choice, including an explicit opt-out value, is left alone.
  assert.deepEqual(proxyEnvironmentLines({ HTTPS_PROXY: 'http://127.0.0.1:3128', NODE_USE_ENV_PROXY: '1' }), []);
});
