import { FlagSpriteOptionsKey } from './flag-sprite-options-key';

export interface FlagSpriteOptions {
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
