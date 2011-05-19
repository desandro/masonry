JS_ENGINE ?= `which node nodejs`
JS = jquery.masonry.js
JS_MIN = jquery.masonry.min.js
SITE = masonry-site

# minifies jquery.masonry.js
# requires NodeJS and global uglify-js
min: ${ISO}
	@@if test ! -z ${JS_ENGINE}; then \
		echo "Minifying" ${JS}; \
		uglifyjs ${JS} > ${JS_MIN}.tmp; \
		echo ';' >> ${JS_MIN}.tmp; \
		sed 's/\*\//&§/; y/§/\n/;' ${JS_MIN}.tmp > ${JS_MIN}; \
		rm ${JS_MIN}.tmp; \
	else \
		echo "NodeJS required for minification."; \
	fi

# creates zip file of site
zip: _site
	mkdir ${SITE}
	cp -r _site/ ${SITE}
	zip -r ~/Desktop/${SITE}.zip ${SITE}/
	rm -rf ${SITE}