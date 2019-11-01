.PHONY: all yolo build docker-build docker-run
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
build:
	docker build -f Dockerfile.build . -t fof/dashboard-ui-build
	rm -rf ./build/*; \
	id=$$(docker create fof/dashboard-ui-build);\
	docker cp $$id:/app/build/. ./build/;\
	docker rm -v $$id
docker-build:
	docker build -t fof/dashboard-ui .
docker-run:
	docker-compose -f docker-compose.yml run --service-ports web