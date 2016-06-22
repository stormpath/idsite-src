#! /bin/bash

echo "You'll need to know your Stormpath api key id, api key secret and application href in order to proceed"
echo

echo "Setting up..."
echo

echo "Executing: npm install..."
npm install

if [ $? -eq 0 ]
then
  echo "Successfully ran: npm install"
else
  echo "npm install failed"
fi

echo "Executing: bower install..."
bower install

if [ $? -eq 0 ]
then
  echo "Successfully ran: bower install"
else
  echo "bower install failed"
fi

echo "Setting up localtunnel..."
cd localtunnel
npm install

if [ $? -eq 0 ]
then
  echo "Successfully setup localtunnel"
else
  echo "Failed to setup localtunnel"
fi

cd ..

echo "Setting up fakesp..."
cd fakesp
npm install

if [ $? -eq 0 ]
then
  echo "Successfully setup fakesp"
else
  echo "Failed to setup fakesp"
fi

cd ..
echo

read -e -p "Enter your Stormpath API Key ID and press [ENTER]: " STORMPATH_CLIENT_APIKEY_ID
[ -z "${STORMPATH_CLIENT_APIKEY_ID}" ] && echo "Must specify a Stormpath API Key ID" && exit 1

read -e -p "Enter your Stormpath API Key Secret and press [ENTER]: " STORMPATH_CLIENT_APIKEY_SECRET
[ -z "${STORMPATH_CLIENT_APIKEY_SECRET}" ] && echo "Must specify a Stormpath API Key Secret" && exit 1

read -e -p "Enter your Stormpath Application HREF and press [ENTER]: " STORMPATH_APPLICATION_HREF
[ -z "${STORMPATH_APPLICATION_HREF}" ] && echo "Must specify a Stormpath Application HREF" && exit 1

read -e -p "Enter local domain and press [ENTER] (default: localhost): " DOMAIN
[ -z "${DOMAIN}" ] && DOMAIN=localhost

export STORMPATH_CLIENT_APIKEY_ID STORMPATH_CLIENT_APIKEY_SECRET STORMPATH_APPLICATION_HREF DOMAIN

echo
echo "Running fakesp..."
cd fakesp
EXPR="node server.js > ../fakesp.log 2>&1 &"
eval $EXPR
FAKESP_PID=$!
cd ..

echo "Running localtunnel..."
cd localtunnel
EXPR="node localtunnel.js > ../localtunnel.log 2>&1 &"
eval $EXPR
LOCALTUNNEL_PID=$!
cd ..

echo "Launching browser..."
sleep 1
open http://localhost:8001

echo
echo "Running grunt serve..."
grunt serve 
