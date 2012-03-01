#!/bin/bash
stop(){
  proc=`cat $1/proxy.pid`
  kill $proc
  exit 0
}

ENVLINE=`cat config/runtime.json | grep log_folder`
pattern='\"([^"]+)\"[,\s]*$'
if [[ $ENVLINE =~ $pattern ]]
  then
  stop ${BASH_REMATCH[1]}
elif [[ `cat config/default.json | grep log_folder` =~ $pattern ]]
    then
    stop ${BASH_REMATCH[1]}
  else
    echo "log_folder directive not found."
  fi
fi