// Node's built-in fetch ignores the proxy variables unless NODE_USE_ENV_PROXY is set. Behind a proxy, a tool that
// reports with fetch, such as the skills CLI, then fails without a message. These lines make every command of a
// Claude Code session use the proxy; they are empty when no proxy is configured or the setting already exists.
export function proxyEnvironmentLines(env) {
  const proxied = ['HTTPS_PROXY', 'https_proxy', 'HTTP_PROXY', 'http_proxy'].some((name) => env[name]);
  return proxied && !env.NODE_USE_ENV_PROXY ? ['export NODE_USE_ENV_PROXY=1'] : [];
}
