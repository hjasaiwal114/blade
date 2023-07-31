import type { DotNotationSpacingStringToken } from '~utils/types';

type CarouselProps = {
  children: React.ReactNode;
  visibleItems?: 1 | 2 | 3;
  bleed?: 'left' | 'right' | 'both' | 'none';
  autoPlay?: boolean;
  showIndicators?: boolean;
  showOverlay?: boolean;
  overlayColor?: string;
  navigationButtonPosition?: 'bottom' | 'side';
  navigationButtonSpacing?: DotNotationSpacingStringToken;
  navigationButtonVariant?: 'filled' | 'stroke';
  indicatorVariant?: 'gray' | 'white' | 'blue';
  onChange: (slideIndex: number) => void;
};

export type { CarouselProps };
