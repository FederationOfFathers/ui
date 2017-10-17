all:
	npm run build
	git add build/**
	git status
yolo:
	npm run build
	git add build/**
	git status
	git commit -m "yolo" .
	git push
