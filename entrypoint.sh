#!/bin/sh

chmod 600 /entrypoint.sh

echo $GZCTF_FLAG > /flag
chown proxy:proxy /flag
chmod 400 /flag
unset GZCTF_FLAG

set -eu

ADDRESS=$(cat /geth/address)
CHAIN_ID=$(cat /geth/chain_id)

geth \
    --datadir="/geth" \
    --password="/geth/password" \
    --allow-insecure-unlock \
    --unlock="$ADDRESS" \
    --miner.etherbase="$ADDRESS" \
    --mine \
    --networkid="$CHAIN_ID" --nodiscover \
    --http --http.addr=0.0.0.0 --http.port=58545 \
    --http.api=eth,net,web3 \
    --http.corsdomain='*' --http.vhosts='*' &

(cd /app && (node /app/dist/index.js&))

tail -f /dev/null
