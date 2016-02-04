#!/usr/bin/env node

var fs = require('fs');

var program = require('commander');

var pkg = require('../package.json');

var renderSublime = require('../dist').renderSublime;

program
  .version(pkg.version)
  .description(pkg.description)
  .command('color-scheme-parser <file>', 'parse a color-scheme yaml file')
  .option('-o, --outfile <path>', 'outfile')
  .action(function(file) {
    var outfile = program.outfile;
    var scheme = renderSublime(file);

    if (outfile) {
      fs.writeFile(outfile, scheme, (err) => {
        if (err) {
          throw err;
        }

        console.log(`Output saved to ${outfile}`);
      });
    } else {
      console.log(scheme);
    }
  })
  .parse(process.argv);
