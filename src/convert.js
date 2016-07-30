import fs from 'fs';
import path from 'path';

import Handlebars from 'handlebars';

import AtomThemeConverter from './atom-theme-converter';

export const command = 'convert <file>';

export const describe = 'Convert Atom color schemes to Sublime color schemes';

export const builder = {
  outfile: {
    describe: 'Outfile. If not file is provided, output will be written to stdout',
    alias: 'o',
    type: 'string'
  },
  name: {
    describe: 'Name for the scheme. If no name is provided, the folder name will be used',
    alias: 'n',
    type: 'string'
  }
};

export const handler = function(argv) {
  const { file, outfile, name } = argv;

  const templatePath = path.resolve(__dirname, '..', 'templates', 'sublime.hbs');
  const template = Handlebars.compile(fs.readFileSync(templatePath, 'utf8'));
  const converter = new AtomThemeConverter(file, name);

  return converter.getContext().then((context) => {
    const result = template(context);

    if (outfile) {
      fs.writeFileSync(outfile, result);
    } else {
      console.log(result);
    }
  }).catch((err) => {
    console.error(err);
  });
};
