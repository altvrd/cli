#!/bin/zsh
# Copyright (c) 2015-present, Facebook, Inc.
#
# File was inspired by create-react-app's screencast script, found here
# https://github.com/facebook/create-react-app/blob/master/tasks/screencast.sh

set -e

typing() {
	echo $1 | pv -qL $((10 + (-2 + RANDOM % 5)))
}

# Execution

printf '\e[32m%s\e[m' "~ "
typing "altvrd install altmp/ls-gangwar"
altvrd install altmp/ls-gangwar

printf '\e[32m%s\e[m' "~ "
sleep 2
typing "cat altvrd.json"
cat altvrd.json
echo ''

printf '\e[32m%s\e[m' "~ "
sleep 2
typing "ls resources/"
ls resources
sleep 4 && echo ''
