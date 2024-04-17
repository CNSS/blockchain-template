FROM node:18-alpine

COPY app /app

COPY entrypoint.sh /entrypoint.sh

COPY --from=ethereum/client-go:v1.13.14 /usr/local/bin/geth /usr/local/bin/

RUN chmod +x /entrypoint.sh /app/init.sh &&\
    /app/init.sh &&\
    rm -rf /app/init.sh

ENTRYPOINT ["/entrypoint.sh"]
