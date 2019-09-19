FROM alpine

RUN apk add --no-cache curl

RUN curl https://get.fly.io/flyctl.sh | sh

COPY entrypoint.sh /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]