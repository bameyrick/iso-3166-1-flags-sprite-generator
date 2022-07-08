# ISO-3166-1 Flags Generator

Generate a css sprite for iso-3166-1 country flags

[![GitHub release](https://img.shields.io/github/release/bameyrick/iso-3166-1-flags-sprite-generator.svg)](https://github.com/bameyrick/iso-3166-1-flags-sprite-generator/releases)
[![Build Status](https://travis-ci.com/bameyrick/iso-3166-1-flags-sprite-generator.svg?branch=main)](https://travis-ci.com/github/bameyrick/iso-3166-1-flags-sprite-generator)
[![codecov](https://codecov.io/gh/bameyrick/iso-3166-1-flags-sprite-generator/branch/main/graph/badge.svg)](https://codecov.io/gh/bameyrick/iso-3166-1-flags-sprite-generator)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/db81c43235c14f0db58a66dc07f161cc)](https://www.codacy.com/manual/bameyrick/iso-3166-1-flags-sprite-generator)

- [ISO-3166-1 Flags Generator](#iso-3166-1-flags-generator)
  - [Install](#install)
    - [npm](#npm)
    - [yarn](#yarn)
  - [Documentation](#documentation)
  - [Usage](#usage)
  - [Options](#options)
    - [Available options](#available-options)

## Install

You can install via npm or yarn.

### npm

```bash
npm install --save iso-3166-1-flags-sprite-generator
```

### yarn

```bash
yarn add iso-3166-1-flags-sprite-generator
```

## Documentation

This documentation is written in TypeScript, however this library works fine in vanilla JavaScript too.

## Usage

```typescript
import createFlagSprite from 'iso-3166-1-flags-sprite-generator';

async function myFn(): Promise<void> {
  await createFlagSprite('assets/img', 'styles');
}
```

## Options

Options can be provided to the method as the third argument

```typescript
import createFlagSprite from 'iso-3166-1-flags-sprite-generator';

async function myFn(): Promise<void> {
  await createFlagSprite('assets/img', 'styles', { width: 120, center: false });
}
```

### Available options

| Option          | Type    | description                                                                                            | Default value                    |
| --------------- | ------- | ------------------------------------------------------------------------------------------------------ | -------------------------------- |
| center          | boolean | Whether to center the flag horizontally                                                                | true                             |
| classPrefix     | string  | Prefix for css classes                                                                                 | flag                             |
| createDemoFile  | boolean | Whether to create a demo file                                                                          | true                             |
| cssFileName     | string  | Name for the generated css file                                                                        | flags                            |
| demoDestination | string  | Destination for the demo html file. Will have no affect if createDemoFile is set to false              | same as provided css destination |
| lowecaseAlpha2  | boolean | Whether to set the alpha2 code in the css classnames to lowercase                                      | false                            |
| spriteFileName  | string  | Name for the generated sprite png file                                                                 | flag-sprite                      |
| width           | number  | Maximum width of the flags. Note, all flags will be the same height but not necessarily the same width | 60                               |
| silent          | boolean | Whether to suppress logging                                                                            | false                            |
