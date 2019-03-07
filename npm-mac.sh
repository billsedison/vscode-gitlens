#!/bin/sh
# For issue https://github.com/eamodio/vscode-gitlens/issues/644

if [[ "$#" -ne 1 && "$#" -ne 2 ]]; then
  echo "Usage sh $0 install"
  echo "Usage sh $0 run build"
  echo "Usage sh $0 run rebuild"
  echo "Usage sh $0 run clean"
  echo "Usage sh $0 run lint"
  echo "..."
  exit
fi

# 1. Backup the current package.json
mv ./package.json ./package.json.orig

# 2. Call node script to generate the simplified package.json
node npm-mac.js

if [ "$#" -eq 1 ]; then
  echo "npm $1"
  npm $1
else
  echo "npm $1 $2"
  npm $1 $2
fi

# 3. Rename the backup package.json back
mv ./package.json.orig ./package.json

# 4 if the command is pack, then do further things to package the