#!/usr/bin/env bash

node ./minify.js
cp -R ./src/assets/img/ ./build/img/
cp -R ./src/assets/fonts/ ./build/fonts/
cp ./src/sitemap.xml ./build/sitemap.xml
rm -rf ./build/blog/
mkdir ./build/blog
node compilePosts.js
node generateSitemap.js