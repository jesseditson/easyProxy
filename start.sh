#!/bin/bash
node proxy &
proc=$!;
echo $proc > tmp/proxy.pid
disown
exit 0