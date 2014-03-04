#!/bin/bash

export pid="/var/run/goldenempire.pid"
export user="svc_goldenempire"
export log="~/goldenempire/log"

cd ~/goldenempire
mkdir -p $log
chown $user:$user $log

touch $pid
chown $user:$user $pid

su $user -c "/usr/astra/node/bin/forever $1 -p /home/svc_$provider/ -a -l "$log"/startup.log -o "$log"/startup.log -e "$log"/startup.log --pidFile $pid $service"