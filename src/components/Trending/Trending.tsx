import React, { useLayoutEffect, useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import { Pagination, Table, Image, Paper } from '@mantine/core';
import { format } from 'date-fns';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import tmdbServices from '@/services/tmdbServices';
import tmdbApiConstants from '@/constants/tmdbApi.constants';

const Trending = () => {
  // DONE: synced pagination state with the url
  const [searchParams, setSearchParams] = useSearchParams();

  const [page, setPage] = useState(+(searchParams.get('page') ?? 1));

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['movies:trending', page],
    queryFn: () =>
      tmdbServices.movies.trending('week', {
        page,
      }),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
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

  return (
    <div className="h-screen font-montserrat font-medium">
      <SkeletonTheme baseColor="#202020" highlightColor="#444">
        <Table className="overflow-y-scroll h-full">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Poster</Table.Th>
              <Table.Th>Title</Table.Th>
              <Table.Th>Popularity</Table.Th>
              <Table.Th>Release Date</Table.Th>
              <Table.Th>Vote Average</Table.Th>
              <Table.Th>Vote Count</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {data && !isFetching && !isLoading
              ? data.results.map((movie) => (
                  <Table.Tr key={movie.id}>
                    <Table.Td>
                      <Image
                        src={tmdbApiConstants.w500Image(movie.poster_path)}
                        radius="md"
                        alt={movie.title}
                        // DONE: prevented content layout shift
                        className="transition-transform hover:scale-125 w-24 aspect-[2/3]"
                      />
                    </Table.Td>
                    <Table.Td>
                      <Link
                        to={`../${movie.id}`}
                        relative="path"
                        className="hover:underline text-lg font-roboto"
                      >
                        {movie.title}
                      </Link>
                    </Table.Td>
                    <Table.Td>{movie.popularity.toFixed(2)}</Table.Td>
                    <Table.Td>{format(new Date(movie.release_date), 'MMM d yyyy')}</Table.Td>
                    <Table.Td>{movie.vote_average.toFixed(2)}</Table.Td>
                    <Table.Td>{movie.vote_count}</Table.Td>
                  </Table.Tr>
                ))
              : new Array(Math.floor(window.innerHeight / 136)).fill(0).map((_, index) => (
                  <Table.Tr key={index}>
                    <Table.Td className="">
                      <Skeleton className="w-20 h-32" />
                    </Table.Td>
                    <Table.Td>
                      <Skeleton className="h-6" />
                    </Table.Td>
                    <Table.Td>
                      <Skeleton className="h-6" />
                    </Table.Td>
                    <Table.Td>
                      <Skeleton className="h-6" />
                    </Table.Td>
                    <Table.Td>
                      <Skeleton className="h-6" />
                    </Table.Td>
                    <Table.Td>
                      <Skeleton className="h-6" />
                    </Table.Td>
                  </Table.Tr>
                ))}
          </Table.Tbody>
        </Table>
        <Paper
          shadow="xs"
          bg="dark"
          withBorder
          className="flex justify-end items-center fixed left-2 right-2 bottom-2 px-3 py-1.5"
        >
          <Pagination
            total={data?.total_pages ?? 1}
            value={page}
            onChange={handlePageChange}
            siblings={2}
          />
        </Paper>
      </SkeletonTheme>
    </div>
  );
};

export default Trending;
