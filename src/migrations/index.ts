import * as migration_20261028_104903_baseline from './20261028_104903_baseline';
import * as migration_20261028_105347_localize_content from './20261028_105347_localize_content';

export const migrations = [
  {
    up: migration_20261028_104903_baseline.up,
    down: migration_20261028_104903_baseline.down,
    name: '20261028_104903_baseline',
  },
  {
    up: migration_20261028_105347_localize_content.up,
    down: migration_20261028_105347_localize_content.down,
    name: '20261028_105347_localize_content'
  },
];
