#!/bin/bash
logFolder=`./scripts/getJsonVal.sh log_folder`
app=`./scripts/getJsonVal.sh main package.json`
if [[ $logFolder != "fail" ]]
  then
  echo "shutting down."
  proc=`cat $logFolder/$app.pid`
  kill $proc
  exit 0
else
  echo "Failed to find log folder. Not shutting down."
  exit 1
fi