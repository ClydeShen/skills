export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Agents write prose bodies and long trailers; line length there carries no signal.
    'body-max-line-length': [0],
    'footer-max-line-length': [0],
  },
};
