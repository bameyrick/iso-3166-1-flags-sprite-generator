import { Dictionary } from '@qntm-code/utils';

export function cssPropertiesToString(properties: Dictionary<string>): string {
  return Object.entries(properties).reduce((result, [property, value]) => (result += `\n  ${property}: ${value};`), '');
}
