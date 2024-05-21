import { BadgeProps } from '@mantine/core';

export type TBadgesRenderingData<T extends Record<string, any>> = Array<{
  key: keyof T;
  value: string | number;
  props: BadgeProps;
}>;
