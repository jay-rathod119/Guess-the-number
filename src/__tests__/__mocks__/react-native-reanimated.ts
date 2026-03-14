export default {
  useSharedValue: (val: unknown) => ({ value: val }),
  useAnimatedStyle: (fn: () => unknown) => fn(),
  withTiming: (val: unknown) => val,
  withSpring: (val: unknown) => val,
  withSequence: (...vals: unknown[]) => vals[vals.length - 1],
  withDelay: (_: unknown, val: unknown) => val,
  Easing: {
    out: (fn: unknown) => fn,
    cubic: 'cubic',
  },
  createAnimatedComponent: (component: unknown) => component,
};

export const useSharedValue = (val: unknown) => ({ value: val });
export const useAnimatedStyle = (fn: () => unknown) => fn();
export const withTiming = (val: unknown) => val;
export const withSpring = (val: unknown) => val;
export const withSequence = (...vals: unknown[]) => vals[vals.length - 1];
export const withDelay = (_: unknown, val: unknown) => val;
export const Easing = {
  out: (fn: unknown) => fn,
  cubic: 'cubic',
};
