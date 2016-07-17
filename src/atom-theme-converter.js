const fs = require('fs');
const path = require('path');

const _ = require('lodash');
const less = require('less');
const css = require('css');
const tinycolor = require('tinycolor2');

module.exports = class AtomThemeConverter {
  constructor(themeFile, name) {
    this.themeFile = path.resolve(themeFile);
    this.content = fs.readFileSync(this.themeFile, 'utf8');
    this.directory = path.dirname(this.themeFile);

    if (!name) {
      this.name = this.directory.split(path.sep).pop();
    }
  }

  _render() {
    return less.render(this.content, {
      paths: [this.directory]
    }).catch((error) => {
      console.error(error);
    });
  }

  getAst() {
    return this._render().then((output) => {
      return css.parse(output.css);
    });
  }

  getScopesById(ast) {
    return new Promise((resolve) => {
      const scopesById = _(ast.stylesheet.rules).map((rule) => {
        return _.map(rule.selectors, (selector) => {
          return {
            selector: selector.trim(),
            declarations: _(rule.declarations).map((declaration) => {
              return _.omit(declaration, ['position', 'type']);
            }).keyBy('property').value()
          };
        });
      }).flatten().keyBy('selector').value();

      resolve(scopesById);
    });
  }

  getTmTheme(scopesById) {
    return new Promise((resolve, reject) => {
      const background = _.get(scopesById, "['atom-text-editor']['declarations']['background-color']['value']");
      const foreground = _.get(scopesById, "['atom-text-editor']['declarations']['color']['value']");
      const caret = _.get(scopesById, "['atom-text-editor .cursor']['declarations']['color']['value']");
      const invisibles = _.get(scopesById, "['atom-text-editor .wrap-guide']['declarations']['background-color']['value']");
      const lineHighlight = _.get(scopesById, "['.cursor-line']['declarations']['background-color']['value']");
      const selection = _.get(scopesById, "['atom-text-editor .selection .region']['declarations']['background-color']['value']");

      const hasRequiredValues = _.every([
        background,
        foreground,
        caret,
        invisibles,
        lineHighlight,
        selection
      ]);

      if (!hasRequiredValues) {
        console.error('background: ', background);
        console.error('foreground: ', foreground);
        console.error('caret: ', caret);
        console.error('invisibles: ', invisibles);
        console.error('lineHighlight: ', lineHighlight);
        console.error('selection: ', selection);

        reject('Not all required values are present. Please check the theme');
      }

      const tmTheme = {
        name: this.name,
        background: tinycolor(background).toHexString(),
        foreground: tinycolor(foreground).toHexString(),
        invisibles: tinycolor(invisibles).toHexString(),
        caret: tinycolor(caret).toHexString(),
        lineHighlight: tinycolor(lineHighlight).toHexString(),
        selection: tinycolor(selection).toHexString(),
        settings: _.map(scopesById, (val, key) => {
          const declarationsByProp = _.keyBy(val.declarations, 'property');
          const fontStyle = _.compact([
            _.get(declarationsByProp['font-style'], 'value'),
            _.get(declarationsByProp['font-weight'], 'value'),
            _.get(declarationsByProp['text-decoration'], 'value')
          ]);
          const foreground = _.get(declarationsByProp['color'], 'value');
          const background = _.get(declarationsByProp['background-color'], 'value');

          return {
            name: key,
            scope: _.trimStart(key, '.'),
            settings: {
              foreground: foreground ? tinycolor(foreground).toHexString() : undefined,
              background: background ? tinycolor(background).toHexString() : undefined,
              fontStyle: fontStyle.length > 0 ? fontStyle.join(' ').trim() : undefined
            }
          };
        })
      };

      resolve(tmTheme);
    });
  }

  getContext() {
    return this.getAst()
      .then((ast) => {
        return this.getScopesById(ast);
      })
      .then((scopesById) => {
        return this.getTmTheme(scopesById);
      });
  }
};
