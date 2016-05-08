import fs from 'fs';

import chai, { expect } from 'chai';
import spies from 'chai-spies';

import Mustache from 'mustache';
import yaml from 'js-yaml';

import ColorSchemeConverter from '../src';

chai.use(spies);

const getFixturePath = function(name) {
  return `${__dirname}/fixtures/${name}.yml`;
};

describe('ColorSchemeConverter', function() {
  before(function () {
    const file = getFixturePath('scheme');

    this.scheme = yaml.safeLoad(fs.readFileSync(file, 'utf-8'));
  });

  describe('#toJSON', function() {
    before(function() {
      this.result = new ColorSchemeConverter(this.scheme).toJSON();
    });

    it('should set the name correctly', function() {
      expect(this.result.name).to.equal('Dark Fusion');
    });

    it('should set the background correctly', function() {
      expect(this.result.background).to.equal('#212A35');
    });

    it('should set the caret correctly', function() {
      expect(this.result.caret).to.equal('#819090');
    });

    it('should set the foreground correctly', function() {
      expect(this.result.foreground).to.equal('#D5D2C3');
    });

    it('should set the invisibles correctly', function() {
      expect(this.result.invisibles).to.equal('#93A1A1');
    });

    it('should set the lineHighlight correctly', function() {
      expect(this.result.lineHighlight).to.equal('#364353');
    });

    it('should set the selection correctly', function() {
      expect(this.result.selection).to.equal('#3C434B');
    });

    it('should should have a uuid', function() {
      expect(this.result.uuid).to.be.a.string;
    });

    it('should set the semanticClass correctly', function() {
      expect(this.result.semanticClass).to.equal('theme.dark.dark_fusion');
    });

    it('should have an array of settings', function() {
      expect(this.result.settings).to.be.an.array;
    });

    it('should have the correct number of scopes', function() {
      const settingsLength = 31;

      expect(this.result.settings.length).to.equal(settingsLength);
    });
  });

  describe('#toSublime', function() {
    it('should call Mustache.render', function() {
      chai.spy.on(Mustache, 'render');

      new ColorSchemeConverter(this.scheme).toSublime();

      expect(Mustache.render).to.have.been.called.once;
    });
  });
});
