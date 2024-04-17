#!/bin/sh

chmod 600 /entrypoint.sh

echo -n $GZCTF_FLAG > /flag
chmod 400 /flag
unset GZCTF_FLAG

set -eu

ADDRESS=$(cat /geth/address)
CHAIN_ID=$(cat /geth/chain_id)

su geth -c '
geth \
    --datadir="/geth" \
    --password="/geth/password" \
    --allow-insecure-unlock \
    --unlock="'$ADDRESS'" \
    --miner.etherbase="'$ADDRESS'" \
    --mine \
    --networkid="'$CHAIN_ID'" --nodiscover \
    --http --http.addr=127.0.0.1 --http.port=58545 \
    --http.api=eth,net,web3 \
    --http.corsdomain=* --http.vhosts=* \
    --discovery.dns="" \
    --maxpeers=0 \
    --nodiscover=true \
    --ipcdisable=true \
    --ws=false &
'

su app -c '
(cd /app && (node /app/dist/index.js&))
'

tail -f /dev/null
