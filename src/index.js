import YAML from 'yamljs';
import _ from 'lodash';

export default function(file) {
  var content = YAML.load(file);

  let result = _.mapValues(content, (val) => {
    val.scopes = _.map(val.scopes, (scope) => {
      if (_.isString(scope)) {
        let obj = {};

        obj[scope] = {
          styles: {
            fontStyle: []
          }
        };

        return obj;
      }

      return scope;
    });

    return val;
  });

  // console.log(JSON.stringify(result, null, 2));

  return result;
}
