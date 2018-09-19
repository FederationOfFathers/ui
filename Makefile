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
	npm run deploy
docker-build:
	docker build -t fof/dashboard-ui .
docker-run:
	docker-compose -f docker-compose.yml run --service-ports web