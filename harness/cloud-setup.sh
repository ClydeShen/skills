#!/usr/bin/env bash
# Bootstrap a hosted agent workspace (Claude cloud, Codex cloud or similar) for this repository.
# Installs Node.js 24 when the image ships another major version, then runs `npm ci`, which also
# enables the Git hooks. Safe to repeat. Procedure and required environment settings: docs/HARNESS.md.
set -euo pipefail

NODE_VERSION="${NODE_VERSION:-24.22.2}" # must stay within package.json "engines"
PREFIX="${NODE_PREFIX:-$HOME/.local/node-$NODE_VERSION}"
BIN_DIR="${NODE_BIN_DIR:-$HOME/.local/bin}" # put ahead of the image's Node on PATH by symlink

repo="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if [ "$(uname -s)" != "Linux" ]; then
  echo "cloud-setup: Linux only. Install Node.js 24 with your platform's installer, then run npm ci." >&2
  exit 1
fi
case "$(uname -m)" in
  x86_64) arch=x64 ;;
  aarch64 | arm64) arch=arm64 ;;
  *)
    echo "cloud-setup: unsupported architecture $(uname -m)" >&2
    exit 1
    ;;
esac

current="$(node -v 2>/dev/null || true)"
if [ "${current%%.*}" != "v24" ]; then
  if [ ! -x "$PREFIX/bin/node" ]; then
    tarball="node-v$NODE_VERSION-linux-$arch.tar.xz"
    tmp="$(mktemp -d)"
    trap 'rm -rf "$tmp"' EXIT
    curl -fsSL -o "$tmp/$tarball" "https://nodejs.org/dist/v$NODE_VERSION/$tarball"
    curl -fsSL -o "$tmp/SHASUMS256.txt" "https://nodejs.org/dist/v$NODE_VERSION/SHASUMS256.txt"
    (cd "$tmp" && grep " $tarball\$" SHASUMS256.txt | sha256sum -c -)
    mkdir -p "$PREFIX"
    tar -xJf "$tmp/$tarball" -C "$PREFIX" --strip-components=1
  fi
  mkdir -p "$BIN_DIR"
  for tool in node npm npx corepack; do ln -sf "$PREFIX/bin/$tool" "$BIN_DIR/$tool"; done
  export PATH="$BIN_DIR:$PATH"
  echo "cloud-setup: add $BIN_DIR ahead of the image's Node on PATH in later shells if it is not already."
fi
node -v

cd "$repo"
# NODE_USE_ENV_PROXY lets the pinned-tool installers use the inherited egress proxy.
NODE_USE_ENV_PROXY=1 npm ci --no-audit --no-fund
