# Color Schemer

[![NPM version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Coveralls Status][coveralls-image]][coveralls-url]
[![Dependency Status][depstat-image]][depstat-url]
[![Downloads][download-badge]][npm-url]

> Convert Atom syntax themes to Sublime syntax themes

## Install

```sh
npm i -g color-scheme-parser
```

## Usage

```
color-schemer convert <file>

Options:
  --version      Show version number                                   [boolean]
  --help         Show help                                             [boolean]
  --outfile, -o  Outfile. If not file is provided, output will be written to
                 stdout                                                 [string]
  --name, -n     Name for the scheme. If no name is provided, the folder name
                 will be used                                           [string]
```

## Example

```sh
color-schemer convert path/to/index.less
```

## License

Apache-2.0 © [Will Soto](http://github.com/paradox41)

[npm-url]: https://npmjs.org/package/color-scheme-parser
[npm-image]: https://img.shields.io/npm/v/color-scheme-parser.svg?style=flat-square

[travis-url]: https://travis-ci.org/paradox41/color-scheme-parser
[travis-image]: https://img.shields.io/travis/paradox41/color-scheme-parser.svg?style=flat-square

[coveralls-url]: https://coveralls.io/r/paradox41/color-scheme-parser
[coveralls-image]: https://img.shields.io/coveralls/paradox41/color-scheme-parser.svg?style=flat-square

[depstat-url]: https://david-dm.org/paradox41/color-scheme-parser
[depstat-image]: https://david-dm.org/paradox41/color-scheme-parser.svg?style=flat-square

[download-badge]: http://img.shields.io/npm/dm/color-scheme-parser.svg?style=flat-square
