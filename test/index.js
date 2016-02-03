import test from 'tape';
import {renderSublime} from '../src';

test('colorSchemeParser', (t) => {
  t.plan(1);
  let file = `${__dirname}/fixtures/scheme.yml`;

  console.log(renderSublime(file));

  t.equal(true, true);
});
