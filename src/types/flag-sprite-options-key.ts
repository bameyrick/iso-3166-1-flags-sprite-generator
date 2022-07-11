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
