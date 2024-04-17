#!/bin/zsh
#zsh compilePlutus.sh https://github.com/IntersectMBO/plutus-apps build-plutus-app plutus-example "cabal run plutus-example" generated-plutus-scripts/v1/always-succeeds-spending.plutus
#2>&1 || true to get bull job result at stdout then check the plutus json file
#shell or docker container require haskel ghc, cabal and the command basename 
GIT_REPO=${1}
BUILD_FOLDER=${2}
SOURCE_CODE_FOLDER=${3}
BUILD_COMMAND=${4}
PLUTUS_OUTPUT_FILE=${5}

echo ${BUILD_COMMAND}

REPO_NAME=$(basename ${GIT_REPO})

cd /tmp
mkdir ${BUILD_FOLDER}
cd ${BUILD_FOLDER}
git clone ${GIT_REPO} 2>&1 || true
cd ${REPO_NAME}/${SOURCE_CODE_FOLDER} 

cabal update 2>&1 || true
echo ${BUILD_COMMAND} | zsh 2>&1 || true
cat /tmp/${BUILD_FOLDER}/${REPO_NAME}/${SOURCE_CODE_FOLDER}/${PLUTUS_OUTPUT_FILE}