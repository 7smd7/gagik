import * as migration_20260202_145209 from './20260202_145209'
import * as migration_20260202_170000_fix_schema from './20260202_170000_fix-schema'

export const migrations = [
  {
    up: migration_20260202_145209.up,
    down: migration_20260202_145209.down,
    name: '20260202_145209',
  },
  {
    up: migration_20260202_170000_fix_schema.up,
    down: migration_20260202_170000_fix_schema.down,
    name: '20260202_170000_fix-schema',
  },
]
