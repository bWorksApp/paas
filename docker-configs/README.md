# Build and Run PAAS service on docker

## Build frontend and backend
- Prepare the .env file with the necessary variables and values in the source code folder of the frontend and backend
- Build frontend
```
docker build -f ./docker-configs/Dockerfile-frontend -t paas-frontend .
```
- Build backend
```
docker build -f ./docker-configs/Dockerfile-api -t paas-backend .
```

## Run PAAS frontend & backend on docker
- Prepare the .env file with the necessary variables and values in docker-configs folder
- Prepare the docker-configs/docker-compose.yml file with the necessary variables and values
- Start PAAS
```
docker-compose -f docker-configs/docker-compose.yml up -d
```
- Stop PAAS
```
docker-compose -f docker-configs/docker-compose.yml down
```

