#!/usr/bin/env node
const yargs = require('yargs');

yargs
  .command(require('./src/convert'))
  .version()
  .help()
  .argv;
