
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

## Deployed staging urls

[Paas App](https://paas.bworks.app/)\
[dApp Examples](https://paas.bworks.app/#/examples)\
[Smart Contracts APIs](https://paas.bworks.app/api/contracts)

## Install & run dev

```
git clone https://github.com/bWorksApp/paas

cd paas
add .env file for frontend Apps:
REACT_APP_LOGIN_URL=http://localhost:3000/auth/login
REACT_APP_API_URL=http://localhost:3000


add .env file for backend API:
#Mongo
DATABASE_HOST=localhost
DATABASE_PORT=27017
DATABASE_ACCOUNT=admin
DATABASE_PASSWORD=****
#GitHub
GITHUB_TOKEN=****

cd paas
yarn
yarn build-lib
yarn api
yarn cms
yarn web
```

## Build & run app

```
git clone https://github.com/bWorksApp/paas
cd paas
export NODE_OPTIONS="--max-old-space-size=8192"
yarn
yarn build-lib
yarn build-api
yarn build-cms
yarn build-web

```

## change the API urls for frontend

```
modify .env file variables reflect the login and API urls.
```

## smart contract repo
[Smart Contracts repo](https://github.com/bWorksApp/paas-smart-contracts)

