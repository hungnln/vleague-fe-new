import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { useCallback, useEffect, useState } from 'react';
import { paramCase } from 'change-case';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import { Link as RouterLink } from 'react-router-dom';
import searchFill from '@iconify/icons-eva/search-fill';
// material
import { styled } from '@mui/material/styles';
import { Box, Link, TextField, Typography, Autocomplete, InputAdornment, Stack, Avatar } from '@mui/material';
// utils
import axios from '../../../utils/axios';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
//
import SearchNotFound from '../../SearchNotFound';
import { debounce } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { getPlayerList } from 'src/redux/slices/player';
import { getClubList } from 'src/redux/slices/club';
import { Form, FormikProvider, useFormik } from 'formik';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  '& .MuiAutocomplete-root': {
    width: 200,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.shorter
    }),
    '&.Mui-focused': {
      width: 240,
      '& .MuiAutocomplete-inputRoot': {
        boxShadow: theme.customShadows.z12
      }
    }
  },
  '& .MuiAutocomplete-inputRoot': {
    '& fieldset': {
      borderWidth: `1px !important`,
      borderColor: `${theme.palette.grey[500_32]} !important`
    }
  },
  '& .MuiAutocomplete-option': {
    '&:not(:last-of-type)': {
      borderBottom: `solid 1px ${theme.palette.divider}`
    }
  }
}));

// ----------------------------------------------------------------------

BlogPostsSearch.propTypes = {
  sx: PropTypes.object
};

export default function BlogPostsSearch({ sx }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const linkTo = (id) => `${PATH_DASHBOARD.blog.root}/post/${id}`;
  const dispatch = useDispatch()

  const handleChangeSearch = async (event) => {
    try {
      const { value } = event.target;
      setSearchQuery(value)
      if (value.trim().length > 0) {
        const response = await axios.get(`/news?title=${value}`);
        console.log(response.data.data.data);
        setSearchResults(response.data.data.data);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error(error);

    }
  };
  const debounceSearch = useCallback(debounce((nextValue) => handleChangeSearch(nextValue), 1000), [])
  const handleInputOnchange = (e) => {
    // console.log(value, 123);
    // setKeyword(value);
    debounceSearch(e);
  }
  return (
    <RootStyle
      sx={{
        ...(!searchQuery && {
          '& .MuiAutocomplete-noOptions': {
            display: 'none',

          }
          // ,
          // '.MuiAutocomplete-inputRoot': {
          //   flexWrap: 'nowrap !important'
          // },
          // ' .Mui-focused': {
          //   flexWrap: ' wrap !important'
          // }
        }),
        ...sx
      }}
    >
      <Autocomplete
        size="small"
        disablePortal
        popupIcon={null}
        options={searchResults}
        onInputChange={handleInputOnchange}
        getOptionLabel={(post) => post.title}
        noOptionsText={<SearchNotFound searchQuery={searchQuery} />}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Search post..."
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <>
                  <InputAdornment position="start">
                    <Box
                      component={Icon}
                      icon={searchFill}
                      sx={{
                        ml: 1,
                        width: 20,
                        height: 20,
                        color: 'text.disabled'
                      }}
                    />
                  </InputAdornment>
                  {params.InputProps.startAdornment}
                </>
              )
            }}
          />
        )}
        renderOption={(props, post, { inputValue }) => {
          const { title, id } = post;
          const matches = match(title, inputValue);
          const parts = parse(title, matches);
          return (
            <li {...props}>
              <Link to={linkTo(id)} component={RouterLink} underline="none">
                {parts.map((part, index) => (
                  <Typography
                    key={index}
                    component="span"
                    variant="subtitle2"
                    color={part.highlight ? 'primary' : 'textPrimary'}
                  >
                    {part.text}
                  </Typography>
                ))}
              </Link>
            </li>
          );
        }}
      />
    </RootStyle >
  );
}
