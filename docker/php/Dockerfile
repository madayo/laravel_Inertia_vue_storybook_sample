FROM php:8.1.6-fpm-alpine
SHELL ["/bin/ash", "-oeux", "pipefail", "-c"]

ARG WORK_DIR

# HOME ディレクトリ作成
ENV HOME /homedir
RUN mkdir -p $HOME

# alpine 用 timezone 設定
RUN apk --update add tzdata && \
  cp /usr/share/zoneinfo/Asia/Tokyo /etc/localtime && \
  apk del tzdata

# locale
ENV LANG=ja_JP.UTF-8 \
  LANGUAGE=ja_JP:ja \
  LC_ALL=ja_JP.UTF-8 \
  # composer environment
  COMPOSER_ALLOW_SUPERUSER=1 \
  COMPOSER_HOME=/composer \
  # Laravel environment
  DB_CONNECTION=mysql \
  DB_HOST=db \
  DB_PORT=3306

COPY --from=composer:2.3.5 /usr/bin/composer /usr/bin/composer

COPY ./php-fpm/php-ini/php.ini /usr/local/etc/php/php.ini

RUN apk update && \
  apk add --update --no-cache git autoconf g++ libtool make libzip-dev libpng-dev libjpeg-turbo-dev freetype-dev && \
  # pecl install redis && \
  docker-php-ext-configure gd --with-jpeg=/usr && \
  docker-php-ext-configure opcache --enable-opcache && \
  docker-php-ext-install opcache bcmath pdo_mysql gd exif zip && \
  # docker-php-ext-enable redis && \
  apk del autoconf g++ libtool make && \
  rm -rf /tmp/*

# RUN locale-gen ja_JP.UTF-8 && \
#   localedef -f UTF-8 -i ja_JP ja_JP.UTF-8

RUN mkdir /var/run/php-fpm

RUN rm -rf /var/cache/apk/*

WORKDIR $WORK_DIR
