import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import searchFill from '@iconify/icons-eva/search-fill';
import trash2Fill from '@iconify/icons-eva/trash-2-fill';
import roundFilterList from '@iconify/icons-ic/round-filter-list';
// material
import { useTheme, styled } from '@mui/material/styles';
import { Box, Toolbar, Tooltip, IconButton, Typography, OutlinedInput, InputAdornment, TextField, Stack } from '@mui/material';
import { DateTimePicker } from '@mui/lab';
import { useFormik } from 'formik';

// ----------------------------------------------------------------------

const RootStyle = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3)
}));

const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter
  }),
  '&.Mui-focused': { width: 320, boxShadow: theme.customShadows.z8 },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${theme.palette.grey[500_32]} !important`
  }
}));

// ----------------------------------------------------------------------

TournamentListToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func
};

export default function TournamentListToolbar({ numSelected, filterName, onFilterName, start, onStart, end, onEnd }) {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      From: start || '',
      To: end || ''
    }
  })
  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;
  const disableFromDate = (date) => {
    return new Date(date).getTime() >= new Date(values.To).getTime()
  }
  const disableToDate = (date) => {
    return new Date(date).getTime() <= new Date(values.From).getTime()
  }
  return (
    <RootStyle
      sx={{
        ...(numSelected > 0 && {
          color: isLight ? 'primary.main' : 'text.primary',
          bgcolor: isLight ? 'primary.lighter' : 'primary.dark'
        })
      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <Stack direction="row" alignItems="center" spacing={2}>
          <SearchStyle
            value={filterName}
            onChange={onFilterName}

            placeholder="Search tournament..."
            startAdornment={
              <InputAdornment position="start">
                <Box component={Icon} icon={searchFill} sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            }
          />
          <DateTimePicker
            shouldDisableDate={(date) => disableFromDate(date)}
            label="Date Start"
            inputFormat="dd/MM/yyyy h.mm a"
            value={values.From}
            onChange={(newValue) => {
              onStart(newValue)
              setFieldValue('From', newValue);

            }}
            renderInput={(params) => <TextField {...params} error={false} />}
          />
          <DateTimePicker
            shouldDisableDate={(date) => disableToDate(date)}
            label="Date End"
            inputFormat="dd/MM/yyyy h.mm a"
            value={values.To}
            onChange={(newValue) => {
              onEnd(newValue)
              setFieldValue('To', newValue);
            }}

            renderInput={(params) => <TextField {...params} error={false} />}
          />
        </Stack>
      )}

      {/* {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <Icon icon={trash2Fill} />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <Icon icon={roundFilterList} />
          </IconButton>
        </Tooltip>
      )} */}
    </RootStyle>
  );
}
