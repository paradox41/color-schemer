import YAML from 'yamljs';
import _ from 'lodash';

export default function(file) {
  var content = YAML.load(file);

  var settings = _(content).map((val, hex) => {
    return _.map(val.scopes, (scope) => {
      if (_.isString(scope)) {
        return {
          name: null,
          scope: scope,
          settings: {
            foreground: hex
          }
        };
      } else {
        let key = _(scope).keys().first();
        let {fontStyle, name} = scope[key];

        return {
          name: name || null,
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
    name: _.get(content, 'name', null),
    settings: settings
  };
}
