#!/bin/zsh
#zsh compilePlutus.sh https://github.com/IntersectMBO/plutus-apps build-plutus-app plutus-example "cabal run plutus-example" generated-plutus-scripts/v1/always-succeeds-spending.plutus
#2>&1 || true to get command return 0 (success)
#shell or docker container require haskel ghc, cabal and the command basename 
#use . for ${2} with project that build from root folder

GIT_REPO=${1}
BUILD_FOLDER=${2}
SOURCE_CODE_FOLDER=${3}
BUILD_COMMAND=${4}
PLUTUS_OUTPUT_FILE=${5}

echo ${BUILD_COMMAND}


cd /tmp
mkdir ${BUILD_FOLDER}
cd ${BUILD_FOLDER}
git clone ${GIT_REPO} repo 2>&1 || true
cd repo/${SOURCE_CODE_FOLDER} 


#make sure compiled json is generated from build command
rm -rf /tmp/${BUILD_FOLDER}/${REPO_NAME}/${SOURCE_CODE_FOLDER}/${PLUTUS_OUTPUT_FILE} 2>&1 || true

cabal update 2>&1 || true
echo ${BUILD_COMMAND} | zsh 2>&1 || true
cat /tmp/${BUILD_FOLDER}/repo/${SOURCE_CODE_FOLDER}/${PLUTUS_OUTPUT_FILE} 2>&1 || true