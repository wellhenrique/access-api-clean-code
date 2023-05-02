SHELL := /bin/bash

dev:
	if which docker-compose >/dev/null; then \
		docker-compose -f docker/docker-compose.yml -f docker/docker-compose.dev.yml up $(FLAG) --build; \
	else \
    docker compose -f docker/docker-compose.yml -f docker/docker-compose.dev.yml up $(FLAG) --build; \
	fi

# prod:
# 
