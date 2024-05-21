import React from 'react';
import { Image, Table } from '@mantine/core';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { TrendingMovie } from '@/types/tmdbApi.types';
import { tmdbImagePathConstructors } from '@/utils/api.utils';

const TableDataRows = ({ movies }: { movies: TrendingMovie[] }) =>
  movies.map((movie) => (
    <Table.Tr key={movie.id}>
      <Table.Td>
        <Image
          src={tmdbImagePathConstructors.postImagePaths.w500(movie.poster_path)}
          radius="md"
          alt={movie.title}
          // DONE: prevented content layout shift
          className="transition-transform hover:scale-125 w-24 aspect-[2/3]"
        />
      </Table.Td>
      <Table.Td>
        <Link to={`../${movie.id}`} relative="path" className="hover:underline text-lg font-roboto">
          {movie.title}
        </Link>
      </Table.Td>
      <Table.Td>{movie.popularity.toFixed(2)}</Table.Td>
      <Table.Td>{format(new Date(movie.release_date), 'MMM d yyyy')}</Table.Td>
      <Table.Td>{+movie.vote_average.toFixed(2)}</Table.Td>
      <Table.Td>{movie.vote_count}</Table.Td>
    </Table.Tr>
  ));

export default TableDataRows;
