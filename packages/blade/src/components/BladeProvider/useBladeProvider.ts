/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { modifyThemeByBrand } from './modifyThemeByBrand';
import type { Theme } from './index';
import { useColorScheme, useBreakpoint } from '~utils';
import type { ColorSchemeNames, ColorSchemeNamesInput, ThemeTokens } from '~tokens/theme';
import { colorSchemeNamesInput } from '~tokens/theme/theme';
import type { TypographyPlatforms } from '~tokens/global';
import type { ColorSchemeModes } from '~tokens/theme/theme';
import { toTitleCase } from '~utils/toTitleCase';
import { throwBladeError } from '~utils/logger';

type ThemeContextValue = {
  theme: Theme;
  colorScheme: ColorSchemeNames;
  setColorScheme: (colorScheme: ColorSchemeNamesInput) => void;
  platform: TypographyPlatforms;
};

/**
 * Reusable hook to be used in BladeProvider.native & BladeProvider.web file
 *
 * This hook processes incoming themeTokens & initialColorScheme
 * And validates & returns the theme values
 */
const useBladeProvider = ({
  themeTokens,
  initialColorScheme,
  brandColor,
}: {
  themeTokens: ThemeTokens;
  initialColorScheme?: ColorSchemeNamesInput;
  brandColor?: string;
}): { theme: Theme; themeContextValue: ThemeContextValue } => {
  if (__DEV__) {
    if (!themeTokens) {
      throwBladeError({
        message: `Expected valid themeTokens of type ThemeTokens to be passed but found ${typeof themeTokens}`,
        moduleName: 'BladeProvider',
      });
    }

    if (initialColorScheme && !colorSchemeNamesInput.includes(initialColorScheme)) {
      throwBladeError({
        message: `Expected color scheme to be one of [${colorSchemeNamesInput.toString()}] but received ${initialColorScheme}`,
        moduleName: 'BladeProvider',
      });
    }
  }

  const { colorScheme, setColorScheme } = useColorScheme(initialColorScheme);
  const { matchedDeviceType } = useBreakpoint({
    breakpoints: themeTokens.breakpoints,
  });

  const onColorMode = `on${toTitleCase(colorScheme)}` as ColorSchemeModes;
  const onDeviceType = `on${toTitleCase(matchedDeviceType)}` as TypographyPlatforms;

  console.log('🚀 ~ file: useBladeProvider.ts:59 ~ brandColor:', brandColor);
  const brandModifiedThemeTokens = brandColor
    ? modifyThemeByBrand(themeTokens, brandColor)
    : themeTokens;

  const theme: Theme = {
    ...brandModifiedThemeTokens,
    colors: brandModifiedThemeTokens.colors[onColorMode],
    elevation: brandModifiedThemeTokens.elevation[onColorMode],
    typography: brandModifiedThemeTokens.typography[onDeviceType],
  };

  const themeContextValue = {
    theme,
    colorScheme,
    setColorScheme,
    platform: onDeviceType,
  };

  return { themeContextValue, theme };
};

export { useBladeProvider };
