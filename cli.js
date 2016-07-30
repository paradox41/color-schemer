#!/usr/bin/env node
const yargs = require('yargs');

yargs
  .command(require('./lib/convert'))
  .version()
  .help()
  .argv;
