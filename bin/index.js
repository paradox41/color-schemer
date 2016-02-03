#!/usr/bin/env node

var program = require('commander');

var pkg = require('../package.json');

var renderSublime = require('../dist').renderSublime;

program
  .version(pkg.version)
  .description(pkg.description)
  .command('color-scheme-parser <file>', 'parse a color-scheme yaml file')
  .option('-o, --outfile', 'outfile')
  .action(function(file) {

    console.log(program.outfile);
    console.log(file);
    console.log(renderSublime(file));
  })
  .parse(process.argv);
