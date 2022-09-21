FROM nginx:1.21.6-alpine
SHELL ["/bin/ash", "-oeux", "pipefail", "-c"]

ARG WORK_DIR

# alpine 用 timezone 設定
RUN apk --update add tzdata && \
  cp /usr/share/zoneinfo/Asia/Tokyo /etc/localtime && \
  apk del tzdata

RUN apk update && \
  apk --update --no-cache add g++ openssl

COPY ./default.conf /etc/nginx/conf.d/default.conf

RUN  rm -rf /var/cache/apk/*

WORKDIR $WORK_DIR
