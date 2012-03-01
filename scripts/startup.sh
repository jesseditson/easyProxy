#!/bin/bash
logFolder=`./scripts/getJsonVal.sh log_folder`
app=`./scripts/getJsonVal.sh main package.json`
if [[ $logFolder != "fail" ]]
  then
  procpid=`cat ${logFolder}/${app}.pid`
  if [ -z $procpid ] || [ -z `ps -e $procpid | grep node` ]
    then
    echo "starting..."
    node $app &
    proc=$!;
    mkdir -p "${logFolder}"
    echo $proc > "${logFolder}/${app}.pid"
    disown
    exit 0
  else 
    echo "Server already running. please shut down first."
    exit 1
  fi
else
  echo "Failed to find log folder. Not shutting down."
  exit 1
fi