all:
	npm install
	npm run build
	git add build/**
	git status
yolo:
	npm install
	npm run build
	git add build/**
	git status
	git commit -m "yolo" .
	git push
	npm run deploy
