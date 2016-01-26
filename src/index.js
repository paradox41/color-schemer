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
        let index = _(scope).keys().first();
        let {fontStyle, name} = scope[index];

        return {
          name: name,
          scope: index,
          settings: {
            fontStyle,
            foreground: hex
          }
        };
      }
    });
  }).flatten().value();
}
