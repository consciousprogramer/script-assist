import { Grid, Loader, Paper, Stack, Text } from '@mantine/core';
import React from 'react';

const AppFallback = () => (
  <Grid justify="center" align="center" h="100vh">
    <Grid.Col span={10}>
      <Paper className="py-10 px-4 m-4" bg="gray">
        <Stack align="center" justify="center" gap="xl">
          <Loader type="dots" size="xl" color="white" />
          <Text className="text-xl font-semibold text-white-800 font-montserrat">
            Initializing App & User Data
          </Text>
        </Stack>
      </Paper>
    </Grid.Col>
  </Grid>
);

export default AppFallback;
