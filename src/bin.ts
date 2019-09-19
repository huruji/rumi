#!/usr/bin/env node

import * as  program from 'commander'


program
  .option('-a', 'output')
  .action(() => {
    console.log('rumi')
  })

program.parse(process.argv)

