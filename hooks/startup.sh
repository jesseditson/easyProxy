#!/bin/bash
start(){
  node app &
  proc=$!;
  mkdir -p "${1}"
  echo $proc > "${1}/proxy.pid"
  disown
  exit 0
}

ENVLINE=`cat config/runtime.json | grep log_folder`
pattern='\"([^"]+)\"[,\s]*$'
if [[ $ENVLINE =~ $pattern ]]
  then
  start ${BASH_REMATCH[1]}
elif [[ `cat config/default.json | grep log_folder` =~ $pattern ]]
    then
    start ${BASH_REMATCH[1]}
  else
    echo "log_folder directive not found."
  fi
fi