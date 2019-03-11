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

# 4 if the command is pack, then do further things to fix the vsix package.
if [[ "$#" -eq 2 && "$1" = "run" && "$2" = "pack" ]]; then
  echo "Fix the vsix package"
  echo "  Unziping gitlens-extended-9.5.1.vsix"
  unzip -qq gitlens-extended-9.5.1.vsix -d gitlens-extended-9.5.1

  echo "  Adding dist/ to vsix"
  cp -fr dist gitlens-extended-9.5.1/extension/

  echo "  Adding bitbucket-comment-app/ to vsix"
  cp -fr bitbucket-comment-app gitlens-extended-9.5.1/extension/
  echo "  Adding bitbucket-comment-viewer-app/ to vsix"
  cp -fr bitbucket-comment-viewer-app gitlens-extended-9.5.1/extension/
  echo "  Adding emoji/ to vsix"
  cp -fr emoji gitlens-extended-9.5.1/extension/
  echo "  Adding images/ to vsix"
  cp -fr images gitlens-extended-9.5.1/extension/
  echo "  Adding node_modules/ to vsix"
  cp -fr node_modules gitlens-extended-9.5.1/extension/
  echo "  Fixing package.json in vsix"
  mv gitlens-extended-9.5.1/extension/package.json.orig gitlens-extended-9.5.1/extension/package.json

  echo "Re-packing vsix package"
  cd gitlens-extended-9.5.1
  zip -qq gitlens-extended-9.5.1.vsix -r .
  mv gitlens-extended-9.5.1.vsix ..
  cd ..

  echo "Cleanup gitlens-extended-9.5.1/"
  rm -fr gitlens-extended-9.5.1
fi
