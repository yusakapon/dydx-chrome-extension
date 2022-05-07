#!/bin/sh

# exec
while :
do
  if [ -d dist ] && [ -e dist/index.html ]; then
    cp src/manifest.json dist/
    cp src/loader.js dist/
    rm dist/index.html
    echo "Finish adjust-dist"
    break
  elif [ -e dist/manifest.json ] && [ -e dist/loader.js ]; then
    echo "adjust-dist is already Finished"
    break
  else
    echo "Continue adjust-dist"
  fi
  sleep 30 # dist/ に各種ファイルが生成されるのを待つため、30秒待機
done
