const fs = require('fs');
const path = require('path');

const Mustache = require('mustache');

const AtomThemeConverter = require('./atom-theme-converter');

exports.command = 'convert <file>';

exports.describe = 'Convert Atom color schemes to Sublime color schemes';

exports.builder = {
  outfile: {
    describe: 'Outfile'
  },
  name: {
    describe: 'Name for the scheme. If no name is provided, the folder name will be used'
  }
};

exports.handler = function(argv) {
  const { file, outfile, name } = argv;

  const templatePath = path.resolve(__dirname, '..', 'templates', 'sublime.mustache');
  const template = fs.readFileSync(templatePath, 'utf8');
  const converter = new AtomThemeConverter(file, name);

  return converter.getContext().then((context) => {
    const result = Mustache.render(template, context);

    if (outfile) {
      fs.writeFileSync(outfile, result);
    } else {
      console.log(result);
    }
  }).catch((err) => {
    console.error(err);
  });
};
