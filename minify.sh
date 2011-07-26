#!/bin/bash

# minifies jquery.masonry.js
# requires nodejs & uglifyjs

JS=jquery.masonry.js
JS_MIN=jquery.masonry.min.js
TMP=$JS_MIN.tmp

uglifyjs $JS > $TMP
echo ';' >> $TMP
sed 's/\*\//&§/g; y/§/\n/;' $TMP > $JS_MIN
rm $TMP
echo "Minified" $JS "as" $JS_MIN
