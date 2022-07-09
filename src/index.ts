#!/usr/bin/env node

import * as yargs from 'yargs';
import { FlagSpriteOptionsKey } from './create-flag-sprite';

const options: Record<FlagSpriteOptionsKey, yargs.Options> = {
  spriteDestination: {
    alias: 'sd',
    describe: 'Where to save the generated sprite',
    type: 'string',
    requiresArg: true,
  },
  cssDestination: {
    alias: 'cd',
    describe: 'Where to save the generated CSS',
    type: 'string',
    requiresArg: true,
  },
  center: {
    alias: 'c',
    describe: 'Whether to center the flag horizontally',
    type: 'boolean',
    default: true,
  },
  classPrefix: {
    alias: 'cp',
    describe: 'Prefix for css classes',
    type: 'string',
    default: 'flag',
  },
  cssFileName: {
    alias: 'cfn',
    describe: 'Name for the generated css file',
    type: 'string',
    default: 'flags',
  },
  demo: {
    alias: 'd',
    describe: 'Whether to create a demo file',
    type: 'boolean',
    default: true,
  },
  demoDestination: {
    alias: 'dd',
    describe: 'Destination for the demo html file. Will have no affect if demo is set to false',
    type: 'string',
    default: 'flags-demo',
  },
  dimensionsClasses: {
    alias: 'dc',
    describe: 'Whether to add dimensions classes',
    type: 'string',
  },
  dimensionsSuffix: {
    alias: 'ds',
    describe: 'Suffix for dimensions classes',
    type: 'string',
    default: 'dims',
  },
  lowecaseAlpha2: {
    alias: 'la',
    describe: 'Whether to set the alpha2 code in the css classnames to lowercase',
    type: 'boolean',
    default: false,
  },
  width: {
    alias: 'w',
    describe: 'Maximum width of the flags. Note, all flags will be the same height but not necessarily the same width',
    type: 'number',
    default: 60,
  },
  spriteFileName: {
    alias: 'sfn',
    describe: 'Name for the generated sprite png file',
    type: 'string',
    default: 'flag-sprite',
  },
  spriteUrl: {
    alias: 'su',
    describe: 'Background url for the sprite (excluding the file name)',
    type: 'string',
  },
  silent: {
    alias: 's',
    describe: 'Whether to suppress logging',
    type: 'boolean',
    default: true,
  },
};

const args = yargs
  .scriptName('flags-sprite')
  .usage('$0 [options] <command ...>')
  .help('h')
  .alias('h', 'help')
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-var-requires
  .version('v', require('../../package.json').version)
  .alias('v', 'V')
  .alias('v', 'version')
  .options(options).argv;

if (!(args instanceof Promise)) {
  console.log(args);
}
