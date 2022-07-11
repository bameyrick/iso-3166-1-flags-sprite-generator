import * as path from 'path';
import * as fs from 'fs';
import { jest } from '@jest/globals';
import rimraf from 'rimraf';

describe(`flags-sprite`, () => {
  beforeEach(() => {
    jest.resetModules();
  });

  afterEach(async () => {
    await Promise.all(
      ['flags-demo', 'test-result', 'tmp'].map(
        directory => new Promise(resolve => rimraf(`${path.join(process.cwd(), directory)}`, resolve))
      )
    );
  });

  it(`Should generate a sprite sheet`, async () => {
    await runCommand('flags-sprite --spriteDestination=test-result --cssDestination=test-result');

    expect(fs.existsSync(path.join(process.cwd(), 'test-result', 'flag-sprite.png'))).toEqual(true);
  });

  it(`Should generate css for the sprite sheet`, async () => {
    await runCommand('flags-sprite --spriteDestination=test-result --cssDestination=test-result');

    expect(fs.existsSync(path.join(process.cwd(), 'test-result', 'flags.css'))).toEqual(true);
  });
});

/**
 * Programmatically set arguments and execute the CLI script
 */
async function runCommand(args: string): Promise<unknown> {
  // return exec(`node dist/index.js ${args}`);
  process.argv = [
    'node', // Not used but a value is required at this index in the array
    'cli.js', // Not used but a value is required at this index in the array
    ...args.split(' '),
  ];

  // Require the yargs CLI script
  return import('../src/index');
}
