import { isString } from 'lodash';
import PropTypes from 'prop-types';
// material
import { LoadingButton } from '@mui/lab';
import { alpha, styled } from '@mui/material/styles';
import { Box, Button, Container, Typography, DialogActions } from '@mui/material';
//
import { DialogAnimate } from '../../animate';
import Markdown from '../../Markdown';
import Scrollbar from '../../Scrollbar';
import EmptyContent from '../../EmptyContent';

// ----------------------------------------------------------------------

const HeroStyle = styled('div')(({ theme }) => ({
  paddingTop: '56%',
  position: 'relative',
  backgroundSize: 'ThumbnailImageURL',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  '&:before': {
    top: 0,
    Content: "''",
    width: '100%',
    height: '100%',
    position: 'absolute',
    backgroundColor: alpha(theme.palette.grey[900], 0.72)
  }
}));

// ----------------------------------------------------------------------

PreviewHero.propTypes = {
  Title: PropTypes.string,
  ThumbnailImageURL: PropTypes.string
};

function PreviewHero({ Title, ThumbnailImageURL }) {
  return (
    <HeroStyle sx={{ backgroundImage: `url(${ThumbnailImageURL})` }}>
      <Container
        sx={{
          top: 0,
          left: 0,
          right: 0,
          margin: 'auto',
          position: 'absolute',
          pt: { xs: 3, lg: 10 },
          color: 'common.white'
        }}
      >
        <Typography variant="h2" component="h1">
          {Title}
        </Typography>
      </Container>
    </HeroStyle>
  );
}

BlogNewPostPreview.propTypes = {
  formik: PropTypes.object.isRequired,
  openPreview: PropTypes.bool,
  onClosePreview: PropTypes.func
};

export default function BlogNewPostPreview({ formik, openPreview, onClosePreview }) {
  const { values, handleSubmit, isSubmitting, isValid } = formik;
  const { Title, description, Content } = values;
  const ThumbnailImageURL = isString(values.ThumbnailImageURL) ? values.ThumbnailImageURL : values.ThumbnailImageURL?.preview;
  const hasContent = Title || description || Content || ThumbnailImageURL;
  const hasHero = Title || ThumbnailImageURL;

  return (
    <DialogAnimate fullScreen open={openPreview} onClose={onClosePreview}>
      <DialogActions sx={{ py: 2, px: 3 }}>
        <Typography variant="subTitle1" sx={{ flexGrow: 1 }}>
          Preview Post
        </Typography>
        <Button onClick={onClosePreview}>Cancel</Button>
        <LoadingButton
          type="submit"
          variant="contained"
          disabled={!isValid}
          loading={isSubmitting}
          onClick={handleSubmit}
        >
          Post
        </LoadingButton>
      </DialogActions>

      {hasContent ? (
        <Scrollbar>
          {hasHero && <PreviewHero Title={Title} ThumbnailImageURL={ThumbnailImageURL} />}
          <Container>
            <Box sx={{ mt: 5, mb: 10 }}>
              <Typography variant="h6" sx={{ mb: 5 }}>
                {description}
              </Typography>
              <Markdown children={Content} />
            </Box>
          </Container>
        </Scrollbar>
      ) : (
        <EmptyContent Title="Empty Content" />
      )}
    </DialogAnimate>
  );
}
