#!/bin/bash

# minifies jquery.masonry.js
# requires nodejs & uglifyjs

IN=jquery.masonry.js
OUT=jquery.masonry.min.js

# remove any lines that begin with /*jshint or /*global
# then, minify with Uglify JS
# then, add newline characters after `*/`, but not last newline character
awk '!/^\/\*[jshint|global]/' $IN \
  | uglifyjs \
  | awk '{ORS=""; gsub(/\*\//,"*/\n"); if (NR!=1) print "\n"; print;}' > $OUT
echo "Minified" $IN "as" $OUT

