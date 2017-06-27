@echo off
IF NOT EXIST "./node_modules" (
  echo Installing dependencies
  npm install
)
node index.js %*