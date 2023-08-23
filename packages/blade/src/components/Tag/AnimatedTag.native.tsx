import React from 'react';
import type { EasingFn } from 'react-native-reanimated';
import Animated, { runOnJS, Keyframe } from 'react-native-reanimated';
import type { ReanimatedKeyframe } from 'react-native-reanimated/lib/typescript/reanimated2/layoutReanimation/animationBuilder/Keyframe';
import { Tag } from './Tag';
import {
  TAG_MAX_WIDTH_END,
  TAG_MAX_WIDTH_START,
  TAG_OPACITY_END,
  TAG_OPACITY_START,
} from './tagAnimationConfig';
import type { AnimatedTagProps } from './types';
import { useTheme } from '~utils';

const useAnimatedTag = (): {
  entering: ReanimatedKeyframe;
  exiting: ReanimatedKeyframe;
} => {
  const { theme } = useTheme();

  const duration = theme.motion.duration.xquick;
  const entranceEasing = (theme.motion.easing.entrance.effective as unknown) as EasingFn;
  const exitEasing = (theme.motion.easing.exit.effective as unknown) as EasingFn;

  const exiting = new Keyframe({
    0: {
      opacity: TAG_OPACITY_START,
      maxWidth: TAG_MAX_WIDTH_START,
    },
    100: {
      opacity: TAG_OPACITY_END,
      maxWidth: TAG_MAX_WIDTH_END,
      easing: exitEasing,
    },
  }).duration(5000);

  const entering = new Keyframe({
    0: {
      opacity: TAG_OPACITY_END,
    },
    100: {
      opacity: TAG_OPACITY_START,
      easing: entranceEasing,
    },
  }).duration(duration);

  return { entering, exiting };
};

const AnimatedTag = ({
  children,
  currentTagIndex,
  activeTagIndex,
  onDismiss,
}: AnimatedTagProps): React.ReactElement | null => {
  const [isTagVisible, setIsTagVisible] = React.useState(true);
  const { entering, exiting } = useAnimatedTag();

  // const onAnimationEnd = (isFinished: boolean): void => {
  //   'worklet';
  //   console.log('onAnimationEnd', { currentTagIndex, children, isFinished });
  //   if (isFinished && !isTagVisible) {
  //     runOnJS(onDismiss)({ tagIndex: currentTagIndexRef.current, tagName: currentTagName.current });
  //   }
  // };

  // const exitingWithCallback = exiting.withCallback(onAnimationEnd);

  return isTagVisible ? (
    <Animated.View entering={entering} exiting={exiting}>
      <Tag
        _isVirtuallyFocussed={currentTagIndex === activeTagIndex}
        _isTagInsideInput={true}
        onDismiss={() => {
          setIsTagVisible(false);
          onDismiss({ tagIndex: currentTagIndex, tagName: children });
        }}
        marginRight="spacing.3"
        marginY="spacing.2"
      >
        {children}
      </Tag>
    </Animated.View>
  ) : null;
};

export { AnimatedTag };
