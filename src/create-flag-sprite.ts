import * as glob from 'glob';
import * as path from 'path';
import * as fs from 'fs';
import chalk from 'chalk';
import { Dictionary, isNullOrUndefined } from '@qntm-code/utils';
import * as sharp from 'sharp';
import * as Spritesmith from 'spritesmith';
import { cssPropertiesToString } from './css-properties-to-string';
import { SpritesmithCoordinates, SpritesmithProperties } from './types';

const TEMP_DIRECTORY = path.join(__dirname, '..', `tmp`).replace(path.join(__dirname, '..', '..'), '');

export enum FlagSpriteOptionsKey {
  /**
   * Whether to center the flag horizontally
   */
  center = 'center',

  /**
   * Prefix for css classes
   */
  classPrefix = 'classPrefix',

  /**
   * Where to save the generated CSS
   */
  cssDestination = 'cssDestination',

  /**
   * Name for the generated css file
   */
  cssFileName = 'cssFileName',

  /**
   * Whether to create a demo file
   */
  demo = 'demo',

  /**
   * Destination for the demo html file. Will have no affect if demo is set to false
   */
  demoDestination = 'demoDestination',

  /**
   * Whether to add dimensions classes
   */
  dimensionsClasses = 'dimensionsClasses',

  /**
   * Suffix for dimensions classes
   */
  dimensionsSuffix = 'dimensionsSuffix',

  /**
   * Whether to set the alpha2 code in the css classnames to lowercase
   */
  lowecaseAlpha2 = 'lowecaseAlpha2',

  /**
   * Where to save the generated sprite
   */
  spriteDestination = 'spriteDestination',

  /**
   * Name for the generated sprite png file
   */
  spriteFileName = 'spriteFileName',

  /**
   * Background url for the sprite (excluding the file name)
   */
  spriteUrl = 'spriteUrl',

  /**
   * Maximum width of the flags. Note, all flags will be the same height but not necessarily the same width
   */
  width = 'width',

  /**
   * Whether to suppress logging
   */
  silent = 'silent',
}

interface FlagSpriteOptions {
  [FlagSpriteOptionsKey.center]?: boolean;
  [FlagSpriteOptionsKey.classPrefix]?: string;
  [FlagSpriteOptionsKey.cssDestination]?: string;
  [FlagSpriteOptionsKey.cssFileName]?: string;
  [FlagSpriteOptionsKey.demo]?: boolean;
  [FlagSpriteOptionsKey.demoDestination]?: string;
  [FlagSpriteOptionsKey.dimensionsClasses]?: boolean;
  [FlagSpriteOptionsKey.dimensionsSuffix]?: string;
  [FlagSpriteOptionsKey.lowecaseAlpha2]?: boolean;
  [FlagSpriteOptionsKey.spriteDestination]?: string;
  [FlagSpriteOptionsKey.spriteFileName]?: string;
  [FlagSpriteOptionsKey.spriteUrl]?: string;
  [FlagSpriteOptionsKey.width]?: number;
  [FlagSpriteOptionsKey.silent]?: boolean;
}

export default async function createFlagSprite(options: FlagSpriteOptions): Promise<void> {
  const mergedOptions: FlagSpriteOptions = {
    center: true,
    classPrefix: 'flag',
    cssFileName: 'flags',
    demo: true,
    demoDestination: 'flags-demo',
    dimensionsSuffix: 'dims',
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

  mergedOptions.width = Math.max(Math.min(mergedOptions.width!, maxIconWidth), 1);

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
      const spriteFilename = `${mergedOptions.spriteFileName!}.png`;
      const spriteFilePath = `${mergedOptions.spriteDestination!}/${spriteFilename}`;
      const spriteUrl = mergedOptions.spriteUrl ? `${mergedOptions.spriteUrl}/${spriteFilename}` : spriteFilePath;
      const demoSpriteName = 'sprite.png';
      const cssFilename = `${mergedOptions.cssFileName!}.css`;
      const cssFilePath = `${mergedOptions.cssDestination!}/${cssFilename}`;
      const demoCssName = `flags.css`;

      let css = createCssStart(properties, spriteUrl, maxWidth, flagHeight, mergedOptions);
      let demoCSS = createCssStart(properties, demoSpriteName, maxWidth, flagHeight, mergedOptions);

      let html = `<!DOCTYPE html><html><head><title>Flags Sprite</title><link rel="stylesheet" type="text/css" href="${demoCssName}"><style>body { font-family: sans-serif; text-align: center; margin 5px; } body > div { display: inline-block; margin: 5px; } .${mergedOptions.classPrefix!}{  width: ${maxWidth}px; height: ${flagHeight}px; }</style></head><body><h1>Created by iso-3166-1-flags-sprite-generator</h1>`;

      Object.entries(coordinates).forEach(([pngPath, { x, y, width, height }]: [string, SpritesmithCoordinates]) => {
        const code = path.basename(pngPath, '.png');

        const className = `${mergedOptions.classPrefix!}-${mergedOptions.lowecaseAlpha2 ? code.toLowerCase() : code}`;

        const cssProperties: Dictionary<string> = {
          ['background-position']: `${((x - (mergedOptions.center ? (maxWidth - width) / 2 : 0)) / (properties.width - maxWidth)) * 100}% ${
            (y / (properties.height - flagHeight)) * 100
          }%`,
        };

        const flagClass = `\n\n.${className} {${cssPropertiesToString(cssProperties)}\n}`;

        css += flagClass;

        demoCSS += flagClass;

        if (mergedOptions.dimensionsClasses) {
          const flagDimensionsClass = `\n\n.${className}-${mergedOptions.dimensionsSuffix!} {${cssPropertiesToString({
            width: `${width}px`,
            height: `${height}px`,
          })}\n}`;

          css += flagDimensionsClass;
          demoCSS += flagDimensionsClass;
        }

        html += `<div><div class="${mergedOptions.classPrefix!} ${className}"></div><p>${className}</p></div>`;
      });

      html += `</body></html>`;

      fs.mkdirSync(mergedOptions.spriteDestination!, { recursive: true });
      fs.mkdirSync(mergedOptions.cssDestination!, { recursive: true });

      fs.createWriteStream(spriteFilePath).write(image);
      fs.writeFileSync(cssFilePath, css, 'utf-8');

      const demoFilePath = `${mergedOptions.demoDestination!}/index.html`;

      if (mergedOptions.demo) {
        fs.mkdirSync(mergedOptions.demoDestination!, { recursive: true });

        fs.writeFileSync(demoFilePath, html, 'utf-8');
        fs.createWriteStream(`${mergedOptions.demoDestination!}/${demoSpriteName}`).write(image);
        fs.writeFileSync(`${mergedOptions.demoDestination!}/${demoCssName}`, demoCSS, 'utf-8');
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
  mergedOptions: FlagSpriteOptions
): string {
  const baseCss: Dictionary<string> = {
    display: `inline-block`,
    background: ` url('${spriteUrl}') no-repeat`,
    ['background-size']: `${(properties.width / maxWidth) * 100}% ${(properties.height / flagHeight) * 100}%`,
    ['vertical-align']: `middle`,
    overflow: `hidden`,
  };

  const dimensionsCss = {
    width: `${mergedOptions.width!}px`,
    height: `${flagHeight}px`,
  };

  return `/**\n * GENERATED BY iso-3166-1-flags-sprite-generator\n */\n\n.${mergedOptions.classPrefix!} {${cssPropertiesToString(
    baseCss
  )}\n}\n\n.${mergedOptions.classPrefix!}-${mergedOptions.dimensionsSuffix!} {${cssPropertiesToString(dimensionsCss)}\n}`;
}
