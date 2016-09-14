#! /bin/bash

function get_property
{
  FILE=$1
  PROPERTY=$2
  sed '/^\#/d' $FILE | grep $PROPERTY  | tail -n 1 | cut -d "=" -f2- | sed 's/^[[:space:]]*//;s/[[:space:]]*$//'
}

function wait_on_service
{
  URL=$1
  for i in {1..10}; do
    STATUS=`curl -s -I $URL | head -n1 | cut -d$' ' -f2`
    if [ "$STATUS" == "" ]; then
      STATUS=0
    fi
    if [ $STATUS == "200" ]; then
      break
    fi
    sleep 1
  done
  if [ $STATUS != "200" ]; then
    echo "Unable to connect to $URL."
    exit 1
  fi
}
    


echo "Setting up..."
echo

hash npm 2>/dev/null || { echo >&2 "npm is required, but it's not installed. Install via: https://github.com/tj/n"; exit 1; }
hash bower 2>/dev/null || { echo >&2 "bower is required, but it's not installed. Install via: npm install -g bower"; exit 1; }
hash grunt 2>/dev/null || { echo >&2 "grunt is required, but it's not installed. Install via: npm install -g grunt-cli"; exit 1; }
hash curl 2> /dev/null || { echo >&2 "curl is required, but it's not installed. Install via: brew install curl (on mac)"; exit 1; }

if [ -n "${STORMPATH_API_KEY_FILE}" ]; then
  STORMPATH_CLIENT_APIKEY_ID=`get_property ${STORMPATH_API_KEY_FILE} "apiKey.id"`
  STORMPATH_CLIENT_APIKEY_SECRET=`get_property ${STORMPATH_API_KEY_FILE} "apiKey.secret"`
elif [ -a ~/.stormpath/apiKey.properties ]; then
  STORMPATH_CLIENT_APIKEY_ID=`get_property ~/.stormpath/apiKey.properties "apiKey.id"`
  STORMPATH_CLIENT_APIKEY_SECRET=`get_property ~/.stormpath/apiKey.properties "apiKey.secret"`
fi

[ -z "${STORMPATH_CLIENT_APIKEY_ID}" ] && read -e -p "Enter your Stormpath API Key ID and press [ENTER]: " STORMPATH_CLIENT_APIKEY_ID
[ -z "${STORMPATH_CLIENT_APIKEY_ID}" ] && echo "Must specify a Stormpath API Key ID" && exit 1

[ -z "${STORMPATH_CLIENT_APIKEY_SECRET}" ] && read -e -p "Enter your Stormpath API Key Secret and press [ENTER]: " STORMPATH_CLIENT_APIKEY_SECRET
[ -z "${STORMPATH_CLIENT_APIKEY_SECRET}" ] && echo "Must specify a Stormpath API Key Secret" && exit 1

[ -z "${STORMPATH_APPLICATION_HREF}" ] && read -e -p "Enter your Stormpath Application HREF and press [ENTER] (default: default Stormpath Application): " STORMPATH_APPLICATION_HREF

[ -z "${DOMAIN}" ] && DOMAIN=localhost

export STORMPATH_CLIENT_APIKEY_ID STORMPATH_CLIENT_APIKEY_SECRET STORMPATH_APPLICATION_HREF DOMAIN

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

echo "Setting up ngrok..."
cd ngrok
npm install

if [ $? -eq 0 ]
then
  echo "Successfully setup ngrok"
else
  echo "Failed to setup ngrok"
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

echo "Running fakesp..."
cd fakesp
EXPR="node server.js > ../fakesp.log 2>&1 &"
eval $EXPR
FAKESP_PID=$!
cd ..

echo "Waiting for fakesep to be available..."
wait_on_service localhost:8001

echo "Running grunt serve..."
EXPR="grunt serve > grunt_serve.log 2>&1 &"
eval $EXPR
GRUNT_SERVE_PID=$!

echo "Waiting for grunt server to be available..."
wait_on_service localhost:9000

echo "Running ngrok..."
cd ngrok
EXPR="node ngrok.js > ../ngrok.log 2>&1 &"
eval $EXPR
NGROK_PID=$!
cd ..

echo "Waiting for ngrok to be available..."
URL=""
for i in {1..10}; do
  URL=`head -n1 ngrok.log`
  if [[ "$URL" == *"ngrok.io"* ]]; then
    break
  fi
  sleep 1
done
if [ "$URL" == "" ]; then
  echo "Unable to connect with ngrok."
  exit 1
fi
wait_on_service $URL

echo
echo "fakesp PID: $FAKESP_PID, ngrok PID: $NGROK_PID, grunt PID: $GRUNT_SERVE_PID"
echo

echo $FAKESP_PID > kill_ez_dev.pids
echo $NGROK_PID >> kill_ez_dev.pids
echo $GRUNT_SERVE_PID >> kill_ez_dev.pids

echo "Tail the logs for more information:"
echo -e "\tfakesp.log"
echo -e "\tngrok.log"
echo -e "\tgrunt_serve.log"
echo

echo "run: ./kill_ez_dev.sh to kill ez dev"
echo

echo "Launching browser..."
sleep 1
open http://localhost:8001
