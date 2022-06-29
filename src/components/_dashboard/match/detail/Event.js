import PropTypes from 'prop-types';
// material
import { Grid, Stack } from '@mui/material';
//

// ----------------------------------------------------------------------

Event.propTypes = {

};

export default function Event() {
    return (
        <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
                <Stack spacing={3}>
                    1
                </Stack>
            </Grid>

            <Grid item xs={12} md={8}>
                <Stack spacing={3}>
                    1
                </Stack>
            </Grid>
        </Grid>
    );
}
