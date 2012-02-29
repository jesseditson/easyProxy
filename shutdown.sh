#!/bin/bash
echo "shutting down server"
proc=`cat tmp/proxy.pid`
kill $proc