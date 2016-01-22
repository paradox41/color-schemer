import test from 'tape';
import colorSchemeParser from '../src';

test('colorSchemeParser', (t) => {
  t.plan(1);

  colorSchemeParser(`${__dirname}/fixtures/scheme.yml`);

  t.equal(true, true);
});
