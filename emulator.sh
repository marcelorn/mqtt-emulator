set -e

if [ ! -d ./node_modules ]; then
  printf "\nInstalling dependencies...\n"
  npm install
fi

node index.js $*
