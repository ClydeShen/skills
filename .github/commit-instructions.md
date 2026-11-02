# Commit messages

Write Conventional Commits: `<type>(<optional scope>): <summary>`.

- Use one type: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore` or `revert`.
- Write the summary in lowercase imperative English, without a final period, in at most 100 characters in the whole header.
- Say what changes for the reader. Do not list files.
- Add a body only when the reason is not obvious from the summary.
- A pull request title follows the same format, because it becomes the squash commit on `main`.

`commitlint.config.mjs` enforces these rules in the `commit-msg` hook and in CI.
