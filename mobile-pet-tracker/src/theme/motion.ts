import { Easing, ReduceMotion } from 'react-native-reanimated';

export const MOTION_FEEDBACK_MS = 150;
export const MOTION_TRANSITION_MS = 250;
export const MOTION_SURFACE_MS = 400;
export const MOTION_STAGGER_MS = 60;
export const MOTION_ENTRANCE_OFFSET_Y = 12;
export const MOTION_SETTLE_SPRING = {
  duration: MOTION_TRANSITION_MS,
  dampingRatio: 1,
  reduceMotion: ReduceMotion.System,
};
export const MOTION_FADE_TIMING = {
  duration: MOTION_TRANSITION_MS,
  easing: Easing.bezier(0.23, 1, 0.32, 1),
  reduceMotion: ReduceMotion.Never,
};
export const MOTION_FILL_TIMING = {
  duration: MOTION_TRANSITION_MS,
  easing: Easing.bezier(0.77, 0, 0.175, 1),
  reduceMotion: ReduceMotion.System,
};

// #153 R4
export const MOTION_ENTRANCE_SCALE = 0.9;
// #153 R4
export const MOTION_FLOAT_OFFSET_Y = 4;
// #153 R4
export const MOTION_FLOAT_TIMING = {
  duration: 1200,
  easing: Easing.bezier(0.37, 0, 0.63, 1),
  reduceMotion: ReduceMotion.System,
};
// #153 R4
export const MOTION_BLINK_INTERVAL_MS = 4000;
// #153 R4
export const MOTION_BLINK_TIMING = {
  duration: 0,
  reduceMotion: ReduceMotion.System,
};
