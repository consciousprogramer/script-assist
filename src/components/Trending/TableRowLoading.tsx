/* eslint-disable @typescript-eslint/no-shadow */
import { Table } from '@mantine/core';
import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

const TableRowLoading = ({ count }: { count: number }) => (
  <SkeletonTheme baseColor="#202020" highlightColor="#444">
    {new Array(Math.floor(window.innerHeight / 136)).fill(0).map((_, index) => (
      <Table.Tr key={index}>
        <Table.Td className="">
          <Skeleton className="w-20 h-32" />
        </Table.Td>
        {new Array(count - 1).fill(0).map((_, i) => (
          <Table.Td key={i}>
            <Skeleton className="w-24 h-6" />
          </Table.Td>
        ))}
      </Table.Tr>
    ))}
  </SkeletonTheme>
);

export default TableRowLoading;
