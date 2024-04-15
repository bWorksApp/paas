#!/bin/zsh
#zsh compilePlutus.sh https://github.com/IntersectMBO/plutus-apps build-plutus-app plutus-example "cabal run plutus-example" generated-plutus-scripts/v1/always-succeeds-spending.plutus
GIT_REPO=${1}
BUILD_FOLDER=${2}
SOURCE_CODE_FOLDER=${3}
BUILD_COMMAND=${4}
PLUTUS_OUTPUT_FILE=${5}



REPO_NAME=$(basename ${GIT_REPO})

cd /tmp
mkdir ${BUILD_FOLDER}
cd ${BUILD_FOLDER}
git clone ${GIT_REPO} 2>&1 || true
cd ${REPO_NAME}/${SOURCE_CODE_FOLDER} 

cabal update
echo ${BUILD_COMMAND} 
cat ${PLUTUS_OUTPUT_FILE} 