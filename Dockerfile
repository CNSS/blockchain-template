FROM node:18-alpine AS ui-builder

COPY ui /ui

WORKDIR /ui

RUN yarn &&\
    yarn build

FROM node:18-alpine AS base

COPY app /app
COPY --from=ui-builder /ui/dist /app/ui

COPY entrypoint.sh /entrypoint.sh
COPY readflag /readflag

COPY --from=ethereum/client-go:v1.13.14 /usr/local/bin/geth /usr/local/bin/

RUN chmod +x /entrypoint.sh /app/init.sh

ENTRYPOINT ["/entrypoint.sh"]

FROM base

RUN /app/init.sh &&\
    rm -rf /app/init.sh