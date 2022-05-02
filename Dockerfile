FROM node:16-slim

WORKDIR /app

RUN apt-get update && \
    apt-get -y install \
    make \
    gcc \
    g++ \
    python3 \
    sudo \
    procps
RUN npm install -g npm @vue/cli

USER node
