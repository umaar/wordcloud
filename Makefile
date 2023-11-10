# The default target must be at the top
.DEFAULT_GOAL := test

install:
	npm install

update-deps:
	ncu -u

test:
	echo "cool"