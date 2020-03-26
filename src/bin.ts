#!/usr/bin/env node

import * as  program from 'commander'
import Bundler from './bundler';
// console.log('000')

program
  .usage('bundle lib')
  .option('-o, --output <...output>')
  .action(async (filename: string) => {
    const entry = filename;
    const bundler = new Bundler({
      entry,
    })
    await bundler.run()
  })
  .parse(process.argv)

// console.log('99')
// console.log(program.arguments)


process.on('unhandledRejection', error => {
  console.error(error);
});



