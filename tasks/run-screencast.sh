#!/bin/zsh

mkdir -p _screencast && cd _screencast

# Initial setup

SCREENCAST_FILE=$(find .. -maxdepth 3 -type f -name 'screencast.sh' | head -1)
rm -f altvrd.json && rm -rf resources
mkdir -p resources
echo '{ "resources": {} }' >altvrd.json

# Execution

asciinema rec -y -c "sh ${SCREENCAST_FILE}" record.json
svg-term --window --in record.json --out ../screencast.svg --padding 5 --width 80 --height 19
cd .. && rm -rf _screencast/
