FROM node:18-alpine as UIBuilder

COPY ui /ui

WORKDIR /ui

RUN yarn &&\
    yarn build

FROM node:18-alpine

COPY app /app
COPY --from=UIBuilder /ui/dist /app/ui

COPY entrypoint.sh /entrypoint.sh
COPY readflag /readflag

COPY --from=ethereum/client-go:v1.13.14 /usr/local/bin/geth /usr/local/bin/

RUN chmod +x /entrypoint.sh /app/init.sh &&\
    /app/init.sh &&\
    rm -rf /app/init.sh

ENTRYPOINT ["/entrypoint.sh"]
