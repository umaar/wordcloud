# The default target must be at the top
.DEFAULT_GOAL := test

install:
	npm install

update-deps:
	ncu -u

test:
	./node_modules/.bin/xo