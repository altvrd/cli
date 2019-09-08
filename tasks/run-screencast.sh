#!/bin/zsh

mkdir -p _screencast && cd _screencast

SCREENCAST_FILE=$(find .. -maxdepth 3 -type f -name 'screencast.sh' | head -1)

# Initial setup

rm -f altvrd.json && rm -rf resources
echo '{ "resources": {} }' >altvrd.json
mkdir -p resources

# Execution

asciinema rec -c "sh ${SCREENCAST_FILE}" record.json
svg-term --in record.json --out ../screencast.svg --padding 15 --width 80 --height 18
cd ..
rm -rf _screencast/
