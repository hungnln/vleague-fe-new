// material
import { styled } from '@mui/material/styles';
import { Box, Grid, Switch, Container, Typography, Stack, CircularProgress, Fade, LinearProgress, TableRow, TableCell } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
// components


// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function LoadingProgress() {
  const [loading, setLoading] = useState(true);
  const timerRef = useRef();
  useEffect(() => {
    const delay = setTimeout(() => {
      setLoading((prevLoading) => !prevLoading);

    }, 5000)
    return () => {
      clearTimeout(delay)
    }
  }, []
  );
  useEffect(() => {
    console.log(loading, 'check data');
  }, [loading])
  return (
    <TableRow sx={{ width: '100%' }}>
      <Fade in={loading}
        unmountOnExit
      >
        <TableCell colSpan={6}> <LinearProgress /></TableCell>
      </Fade>
    </TableRow>

  );
}
