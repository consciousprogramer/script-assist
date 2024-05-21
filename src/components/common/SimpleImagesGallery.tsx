import React from 'react';
import { Card, Text } from '@mantine/core';

const SimpleImagesGallery = <ItemType extends Record<string, any>>({
  title,
  data,
  renderer,
}: {
  title: string;
  data: ItemType[];
  renderer: (item: ItemType) => JSX.Element;
}) => (
  <Card className="my-8" radius="md">
    <Text component="h3" className="font-montserrat text-xl font-semibold">
      {title}
    </Text>
    <div className="flex justify-start items-center flex-nowrap gap-x-3 py-4 w-full overflow-x-scroll no-scrollbar">
      {data.map((item) => renderer(item))}
    </div>
  </Card>
);

export default SimpleImagesGallery;
