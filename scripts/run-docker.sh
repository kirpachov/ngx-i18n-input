#!/bin/bash

docker build . -t ngx-input-workspace &&
  docker run -it -u `id -u $USER` -v .:/app $* ngx-input-workspace