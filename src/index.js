import YAML from 'yamljs';
import _ from 'lodash';

export default function(file) {
  var content = YAML.load(file);

  return _(content).map((val, hex) => {
    return _.map(val.scopes, (scope) => {
      if (_.isString(scope)) {
        return {
          name: null,
          scope,
          settings: {
            foreground: hex
          }
        };
      } else {
        let key = _(scope).keys().first();
        let {fontStyle, name} = scope[key];

        return {
          name: name,
          scope: key,
          settings: {
            fontStyle,
            foreground: hex
          }
        };
      }
    });
  }).flatten().value();
}
