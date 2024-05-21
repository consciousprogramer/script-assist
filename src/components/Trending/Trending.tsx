import React, { useLayoutEffect, useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import {
  Pagination,
  Table,
  Paper,
  Group,
  Loader,
  Affix,
  Transition,
  ActionIcon,
} from '@mantine/core';
import { TbArrowUp } from 'react-icons/tb';
import { useWindowScroll } from '@mantine/hooks';
import tmdbServices from '@/services/tmdbServices';
import TableDataRows from './TableDataRows';
import TableRowLoading from './TableRowLoading';

const Trending = () => {
  // DONE: synced pagination state with the url
  const [searchParams, setSearchParams] = useSearchParams();
  const [scroll, scrollTo] = useWindowScroll();

  const [page, setPage] = useState(+(searchParams.get('page') ?? 1));

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['movies:trending', page],
    queryFn: () =>
      tmdbServices.movies.trending('week', {
        page,
      }),
    placeholderData: keepPreviousData,
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setSearchParams({ page: String(newPage) });
  };

  useLayoutEffect(() => {
    if (!searchParams.get('page')) {
      setSearchParams({ page: '1' });
    }
  }, [searchParams, setSearchParams]);

  const tableHeaders = [
    'Poster',
    'Title',
    'Popularity',
    'Release Date',
    'Vote Average',
    'Vote Count',
  ];

  return (
    <>
      <Table
        className="h-screen font-montserrat font-medium overflow-y-scroll"
        stickyHeader
        withColumnBorders
        highlightOnHover
      >
        <Table.Thead>
          <Table.Tr>
            {tableHeaders.map((head) => (
              <Table.Th key={head}>{head}</Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {data && !isLoading ? (
            <TableDataRows movies={data.results} />
          ) : (
            <TableRowLoading count={tableHeaders.length} />
          )}
        </Table.Tbody>
      </Table>
      <Paper shadow="xs" bg="dark" withBorder className="fixed left-2 right-2 bottom-2 px-3 py-1.5">
        <Group className="w-full" justify="end" gap="xl" align="center">
          {isFetching && <Loader size="sm" />}
          <Pagination
            total={data?.total_pages ?? 1}
            value={page}
            onChange={handlePageChange}
            siblings={2}
          />
        </Group>
      </Paper>
      <Affix position={{ bottom: 64, right: 12 }}>
        <Transition transition="slide-up" mounted={scroll.y > 0}>
          {(transitionStyles) => (
            <ActionIcon style={transitionStyles} color="blue" onClick={() => scrollTo({ y: 0 })}>
              <TbArrowUp />
            </ActionIcon>
          )}
        </Transition>
      </Affix>
    </>
  );
};

export default Trending;
