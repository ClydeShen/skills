import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { once } from 'node:events';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { modelProvider, nvidiaDefaultModel, renderPrompt } from './lib.mjs';

test('the real framework adapter talks to a loopback Chat Completions stub', async () => {
  const temporary = await mkdtemp(join(tmpdir(), 'skills-eval-transport-'));
  const received = [];
  const server = createServer(async (request, response) => {
    let body = '';
    for await (const chunk of request) body += chunk;
    received.push({ url: request.url, body: JSON.parse(body), authorization: request.headers.authorization });
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify({ id: 'synthetic', object: 'chat.completion', choices: [{ index: 0, finish_reason: 'stop', message: { role: 'assistant', content: 'transport-ok' } }], usage: { prompt_tokens: 1, completion_tokens: 1, total_tokens: 2 } }));
  });
  try {
    server.listen(0, '127.0.0.1');
    await once(server, 'listening');
    process.env.PROMPTFOO_DISABLE_TELEMETRY = '1';
    process.env.PROMPTFOO_DISABLE_UPDATE = '1';
    process.env.PROMPTFOO_CONFIG_DIR = temporary;
    const { default: promptfoo } = await import('promptfoo');
    const loopback = `http://127.0.0.1:${server.address().port}/v1`;
    const nvidia = modelProvider({ NVIDIA_API_KEY: 'synthetic-nvidia-key' }, 'nvidia');
    // Override the endpoint only in this test: no request goes to NVIDIA.
    nvidia.config.apiBaseUrl = loopback;
    const record = await promptfoo.evaluate({
      prompts: [renderPrompt('Transport test only.\nSecond line.', { conversation: '用户：测试传输。' })],
      providers: [modelProvider({ EVAL_MODEL: 'transport-stub-not-a-model', EVAL_API_BASE_URL: loopback }), nvidia],
      tests: [{ assert: [{ type: 'equals', value: 'transport-ok' }] }],
      writeLatestResults: false,
      sharing: false,
    }, { cache: false });
    const summary = await record.toEvaluateSummary();
    assert.equal(summary.stats.successes, 2);
    for (const request of received) {
      assert.equal(request.url, '/v1/chat/completions');
      assert.equal(request.body.messages[1].content, '用户：测试传输。');
      assert.ok(request.body.messages[0].content.includes('Transport test only.\nSecond line.'));
    }
    const nvidiaRequest = received.find((request) => request.body.model === nvidiaDefaultModel);
    assert.equal(nvidiaRequest.authorization, 'Bearer synthetic-nvidia-key');
    assert.equal(nvidiaRequest.body.reasoning_effort, 'none');
    assert.equal(nvidiaRequest.body.stream, false);
    assert.equal(nvidiaRequest.body.max_tokens, 4096);
  } finally {
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
    await rm(temporary, { recursive: true, force: true });
  }
});
