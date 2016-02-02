import fs from 'fs';
import path from 'path';

import YAML from 'yamljs';
import _ from 'lodash';

import Mustache from 'mustache';
import uuid from 'node-uuid';

export function colorSchemeParser(file) {
  var content = YAML.load(file);

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

  var name = _.get(content, 'name', '');
  var style = _.get(content, 'style', 'light').toLowerCase();
  var semanticClass = name.split(' ').join('_').toLowerCase();

  return {
    name: name,
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

export function renderSublime(context) {
  let template = loadTemplate(path.resolve(__dirname + '/templates/sublime.mustache'));

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
