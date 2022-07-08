import * as glob from 'glob';
import * as path from 'path';
import * as fs from 'fs';
import * as chalk from 'chalk';
import { Dictionary, isNullOrUndefined } from '@qntm-code/utils';
import * as sharp from 'sharp';
import * as Spritesmith from 'spritesmith';
import { cssPropertiesToString } from './css-properties-to-string';
import { SpritesmithCoordinates, SpritesmithProperties } from './types';

const TEMP_DIRECTORY = path.join(__dirname, '..', `tmp`).replace(path.join(__dirname, '..', '..'), '');

export interface FlagSpriteOptions {
  /**
   * Whether to center the flag horizontally
   */
  center?: boolean;

  /**
   * Prefix for css classes
   */
  classPrefix?: string;

  /**
   * Name for the generated css file
   */
  cssFileName?: string;

  /**
   * Whether to create a demo file
   */
  demo?: boolean;

  /**
   * Destination for the demo html file. Will have no affect if demo is set to false
   */
  demoDestination?: string;

  /**
   * Whether to set the alpha2 code in the css classnames to lowercase
   */
  lowecaseAlpha2?: boolean;

  /**
   * Name for the generated sprite png file
   */
  spriteFileName?: string;

  /**
   * Background url for the sprite (excluding the file name)
   */
  spriteUrl?: string;

  /**
   * Maximum width of the flags. Note, all flags will be the same height but not necessarily the same width
   */
  width?: number;

  /**
   * Whether to suppress logging
   */
  silent?: boolean;
}

interface _FlagSpriteOptions {
  center: boolean;
  classPrefix: string;
  cssFileName: string;
  demo: boolean;
  demoDestination: string;
  lowecaseAlpha2?: boolean;
  spriteFileName: string;
  spriteUrl?: string;
  width: number;
  silent?: boolean;
}

export default async function createFlagSprite(
  spriteDestination: string,
  cssDestination: string,
  options?: FlagSpriteOptions
): Promise<void> {
  const mergedOptions: _FlagSpriteOptions = {
    center: true,
    classPrefix: 'flag',
    cssFileName: 'flags',
    demo: true,
    demoDestination: 'flags-demo',
    width: 60,
    spriteFileName: 'flag-sprite',
    ...options,
  };

  if (!mergedOptions.silent) {
    console.log(chalk.blue('Generating flag sprite'));
  }

  fs.mkdirSync(TEMP_DIRECTORY.substring(1), { recursive: true });

  const originalPNGPaths = glob.sync(`${path.join(__dirname, '..')}/png/*.png`);

  const pngPaths: string[] = [];

  const originalWidths = (
    await Promise.all(originalPNGPaths.map(async originalPath => (await sharp(originalPath).metadata()).width))
  ).filter(item => !isNullOrUndefined(item)) as number[];

  const widestOriginal = Math.max(...originalWidths);

  const maxIconWidth = Math.min(...originalWidths);

  mergedOptions.width = Math.max(Math.min(mergedOptions.width, maxIconWidth), 1);

  const flagHeight = Math.round((mergedOptions.width / widestOriginal) * 240);

  const results = await Promise.all(
    originalPNGPaths.map(async originalPath => {
      const pngPath = `${TEMP_DIRECTORY.substring(1)}/${path.basename(originalPath, '.png')}.png`;

      pngPaths.push(pngPath);

      const png = sharp(originalPath).resize(undefined, flagHeight);

      await png.toFile(pngPath);

      return sharp(pngPath).metadata();
    })
  );

  const widths = results.map(({ width }) => width || 0);

  const maxWidth = Math.max(...widths);

  const padding = Math.ceil((maxWidth - Math.min(...widths)) / 2);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  Spritesmith.run(
    { src: pngPaths, padding },
    (
      _: unknown,
      {
        coordinates,
        properties,
        image,
      }: { coordinates: Dictionary<SpritesmithCoordinates>; properties: SpritesmithProperties; image: unknown }
    ) => {
      const spriteFilename = `${mergedOptions.spriteFileName}.png`;
      const spriteFilePath = `${spriteDestination}/${spriteFilename}`;
      const spriteUrl = mergedOptions.spriteUrl ? `${mergedOptions.spriteUrl}/${spriteFilename}` : spriteFilePath;
      const demoSpriteName = 'sprite.png';
      const cssFilename = `${mergedOptions.cssFileName}.css`;
      const cssFilePath = `${cssDestination}/${cssFilename}`;
      const demoCssName = `flags.css`;

      let css = createCssStart(properties, spriteUrl, maxWidth, flagHeight, mergedOptions);
      let demoCSS = createCssStart(properties, demoSpriteName, maxWidth, flagHeight, mergedOptions);

      let html = `<!DOCTYPE html><html><head><title>Flags Sprite</title><link rel="stylesheet" type="text/css" href="${demoCssName}"><style>body { font-family: sans-serif; text-align: center; margin 5px; } body > div { display: inline-block; margin: 5px; } .${mergedOptions.classPrefix}{  width: ${maxWidth}px; height: ${flagHeight}px; }</style></head><body><h1>Created by iso-3166-1-flags-sprite-generator</h1>`;

      Object.entries(coordinates).forEach(([pngPath, { x, y, width }]: [string, SpritesmithCoordinates]) => {
        const code = path.basename(pngPath, '.png');

        const className = `${mergedOptions.classPrefix}-${mergedOptions.lowecaseAlpha2 ? code.toLowerCase() : code}`;

        const cssProperties: Dictionary<string> = {
          ['background-position']: `${((x - (mergedOptions.center ? (maxWidth - width) / 2 : 0)) / (properties.width - maxWidth)) * 100}% ${
            (y / (properties.height - flagHeight)) * 100
          }%`,
        };

        const flagClass = `\n\n.${className} {${cssPropertiesToString(cssProperties)}\n}`;

        css += flagClass;

        demoCSS += flagClass;

        html += `<div><div class="${mergedOptions.classPrefix} ${className}"></div><p>${className}</p></div>`;
      });

      html += `</body></html>`;

      fs.mkdirSync(spriteDestination, { recursive: true });
      fs.mkdirSync(cssDestination, { recursive: true });

      fs.createWriteStream(spriteFilePath).write(image);
      fs.writeFileSync(cssFilePath, css, 'utf-8');

      const demoFilePath = `${mergedOptions.demoDestination}/index.html`;

      if (mergedOptions.demo) {
        fs.mkdirSync(mergedOptions.demoDestination, { recursive: true });

        fs.writeFileSync(demoFilePath, html, 'utf-8');
        fs.createWriteStream(`${mergedOptions.demoDestination}/${demoSpriteName}`).write(image);
        fs.writeFileSync(`${mergedOptions.demoDestination}/${demoCssName}`, demoCSS, 'utf-8');
      }

      if (!mergedOptions.silent) {
        console.log(chalk.greenBright('Successfully generated flags sprite'));
        console.log(chalk.green(`Sprite: ${spriteFilePath}`));
        console.log(chalk.green(`CSS: ${cssFilePath}`));

        if (mergedOptions.demo) {
          console.log(chalk.green(`Demo: ${demoFilePath}`));
        }
      }
    }
  );
}

function createCssStart(
  properties: SpritesmithProperties,
  spriteUrl: string,
  maxWidth: number,
  flagHeight: number,
  mergedOptions: _FlagSpriteOptions
): string {
  const baseCss: Dictionary<string> = {
    display: `inline-block`,
    background: ` url('${spriteUrl}') no-repeat`,
    ['background-size']: `${(properties.width / maxWidth) * 100}% ${(properties.height / flagHeight) * 100}%`,
    ['vertical-align']: `middle`,
    overflow: `hidden`,
  };

  return `/**\n * GENERATED BY iso-3166-1-flags-sprite-generator\n */\n\n.${mergedOptions.classPrefix} {${cssPropertiesToString(
    baseCss
  )}\n}`;
}
