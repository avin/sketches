#!/bin/sh
cd $TRAVIS_BUILD_DIR/website
yarn
yarn run build
cd $TRAVIS_BUILD_DIR
yarn
yarn run build
