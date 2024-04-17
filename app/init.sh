#!/bin/sh
set -eu

cd /app

yarn config set registry https://registry.npm.taobao.org/
yarn
yarn build

node dist/init.js

adduser --disabled-password --no-create-home --gecos "" --shell /bin/sh geth
adduser --disabled-password --no-create-home --gecos "" --shell /bin/sh app

chown -R geth:geth /geth
chown -R app:app /app

chmod 4755 /readflag
chmod -R 700 /app /geth