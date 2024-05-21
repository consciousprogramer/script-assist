import { ActionIcon, DefaultMantineColor, Tooltip } from '@mantine/core';
import React from 'react';

const MovieActionIcons = ({
  flag,
  whenAbsent,
  whenPresent,
  onClick,
}: {
  flag: boolean;
  whenPresent: { icon: React.ReactNode; msg: string; color: DefaultMantineColor };
  whenAbsent: { icon: React.ReactNode; msg: string; color: DefaultMantineColor };
  onClick: () => void | Promise<void>;
}) => (
  <Tooltip label={flag ? whenPresent.msg : whenAbsent.msg} withArrow position="top-end">
    <ActionIcon
      variant="light"
      color={flag ? whenPresent.color : whenAbsent.color}
      size="sm"
      onClick={onClick}
    >
      {flag ? whenPresent.icon : whenAbsent.icon}
    </ActionIcon>
  </Tooltip>
);

export default MovieActionIcons;
