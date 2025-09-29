#! /bin/bash
docker build -t library:latest web
docker build -t api:latest api
docker-compose up