## Notes
Node version    18.18.0
Yarn version    1.22.19
Npm version     10.8.2
Mongo version   6.0
NextJs          14.2.13
Ra              5.2.1
Mesh            1.7.6

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
CONNECTION_STRING=mongodb://user:password@localhost:27017/psm?authSource=admin&readPreference=primary
GITHUB_TOKEN=****
SHELL_SCRIPTS_PATH="src/flatworks/shellscripts"
REDIS_HOST="localhost"

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
[Plutus smart contracts repo](https://github.com/bWorksApp/paas-plutus-contracts)
[Aiken smart contracts repo](https://github.com/bWorksApp/paas-aiken-contracts)

## dev notes

```
fix aiken stdlib version error:
aikup install
```