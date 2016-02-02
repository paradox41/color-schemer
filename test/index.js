import test from 'tape';
import {colorSchemeParser, renderSublime} from '../src';

test('colorSchemeParser', (t) => {
  t.plan(1);
  let file = `${__dirname}/fixtures/scheme.yml`;

  let context = colorSchemeParser(file);

  console.log(renderSublime(context));

  t.equal(true, true);
});
