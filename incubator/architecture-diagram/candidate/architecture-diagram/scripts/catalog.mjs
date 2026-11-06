export const upstreamCommit = '84487b4891cbc0f32d7e30f34cf878c87cb1f414';
export const upstreamVersion = '32.6.1';
export const styleMap = (style) =>
  Object.fromEntries(
    style
      .split(';')
      .filter((s) => s.includes('='))
      .map((s) => {
        const i = s.indexOf('=');
        return [s.slice(0, i), s.slice(i + 1)];
      }),
  );
