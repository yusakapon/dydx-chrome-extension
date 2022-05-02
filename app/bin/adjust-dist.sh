#!/bin/sh

# move dir
cd ../

# exec
while :
do
  sleep 30
  if [ -e dist/index.html ]; then
    cp src/manifest.json dist/
    cp src/loader.js dist/
    rm dist/index.html
    echo "Finish adjust-dist"
    break
  else
    echo "Continue adjust-dist"
  fi
done
