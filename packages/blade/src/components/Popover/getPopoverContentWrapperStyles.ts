import type React from 'react';
import type { CSSObject } from 'styled-components';
import type { Theme } from '~components/BladeProvider';
import { makeBorderSize, castWebType, isReactNative, makeSpace } from '~utils';

const getPopoverContentWrapperStyles = ({
  theme,
  styles,
}: {
  theme: Theme;
  styles: React.CSSProperties;
}): CSSObject => {
  return {
    minWidth: '100%',
    maxWidth: makeSpace(400),
    display: 'flex',
    flexDirection: 'column',
    gap: makeSpace(theme.spacing[5]),
    backgroundColor: theme.colors.surface.background.level2.lowContrast,
    borderWidth: makeBorderSize(theme.border.width.thin),
    borderRadius: makeBorderSize(theme.border.radius.large),
    borderColor: theme.colors.brand.gray[400].lowContrast,
    borderStyle: 'solid',
    boxShadow: isReactNative() ? undefined : castWebType(theme.elevation.midRaised),
    ...styles,
  };
};

export { getPopoverContentWrapperStyles };
