import fs from 'fs';
import path from 'path';

import _ from 'lodash';
import yaml from 'js-yaml';
import uuid from 'node-uuid';
import Mustache from 'mustache';

class Parser {
  constructor(file) {
    if (!file) {
      throw new Error('No file provided. Please provide the path to a yaml file.');
    }

    this._fromYaml = yaml.safeLoad(fs.readFileSync(file, 'utf-8'));

    return this;
  }

  toSublime() {
    const template = this._loadTemplate(path.resolve(__dirname, '../templates/sublime.mustache'));
    const context = this.toJSON();

    return Mustache.render(template, context);
  }

  toJSON() {
    const content = this._fromYaml;

    const themeName = _.get(content, 'name', '');
    const style = _.get(content, 'style', 'light').toLowerCase();
    const semanticClass = themeName.split(' ').join('_').toLowerCase();

    const settings = _(content).map((val, hex) => {
      return _.map(val.scopes, (scope) => {
        if (_.isString(scope)) {
          return {
            name: this._makeName(scope),
            scope: scope,
            settings: {
              foreground: hex
            }
          };
        } else {
          let key = _(scope).keys().first();
          let {fontStyle, name} = scope[key];

          return {
            name: name || this._makeName(key),
            scope: key,
            settings: {
              fontStyle: fontStyle || null,
              foreground: hex
            }
          };
        }
      });
    }).flatten().value();

    return {
      name: themeName,
      background: _.get(content, 'background', ''),
      caret: _.get(content, 'caret', ''),
      foreground: _.get(content, 'foreground', ''),
      invisibles: _.get(content, 'invisibles', ''),
      lineHighlight: _.get(content, 'lineHighlight', ''),
      selection: _.get(content, 'selection', ''),
      settings: settings,
      uuid: uuid.v4(),
      semanticClass: `theme.${style}.${semanticClass}`
    };
  }

  _makeName(scope) {
    return scope.split('.').map(_.upperFirst).join(' ');
  }

  _loadTemplate(template) {
    return fs.readFileSync(template, 'utf-8');
  }
}

export default Parser;
