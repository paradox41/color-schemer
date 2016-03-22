import fs from 'fs';
import path from 'path';

import YAML from 'yamljs';
import _ from 'lodash';

import Mustache from 'mustache';
import uuid from 'node-uuid';

export function parse(file) {
  var content = YAML.load(file);
  var themeName = _.get(content, 'name', '');
  var style = _.get(content, 'style', 'light').toLowerCase();
  var semanticClass = themeName.split(' ').join('_').toLowerCase();

  var settings = _(content).map((val, hex) => {
    return _.map(val.scopes, (scope) => {
      if (_.isString(scope)) {
        return {
          name: makeName(scope),
          scope: scope,
          settings: {
            foreground: hex
          }
        };
      } else {
        let key = _(scope).keys().first();
        let {fontStyle, name} = scope[key];

        return {
          name: name || makeName(key),
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

export function renderSublime(file) {
  if (!file) {
    throw new Error('No file provided');
  }

  let template = loadTemplate(path.resolve(__dirname, '../templates/sublime.mustache'));
  let context = parse(file);

  return Mustache.render(template, context);
}

/**
 * Helpers
 */
function makeName(scope) {
  return scope.split('.').map(_.upperFirst).join(' ');
}

function loadTemplate(template) {
  return fs.readFileSync(template, 'utf-8');
}
