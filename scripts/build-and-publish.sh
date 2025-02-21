#!/bin/bash

# Run from root.

# Ask user if version from projects/ngx-i18n-input/package.json is correct. If prompt is blank, version is correct, otherwise it's the new version.

read -p "Current version is $(jq -r .version projects/ngx-i18n-input/package.json). Enter new version or press enter to keep it: " version

if [ -n "$version" ]; then
  jq ".version = \"$version\"" projects/ngx-i18n-input/package.json > projects/ngx-i18n-input/package.json.tmp
  mv projects/ngx-i18n-input/package.json.tmp projects/ngx-i18n-input/package.json
fi

echo "Building and publishing..."


cd projects/ngx-i18n-input/ && \
  ng build -c production && \
  cd dist && \
  npm publish