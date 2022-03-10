import { Avatar, Box, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import mime from 'mime/lite';
import PropTypes from 'prop-types';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import GroupWalletCircleSVG from '%/images/organization-indicator.svg';
import core from '~/services/core';
import translate from '~/services/locale';
import notify, { NotificationsTypes } from '~/store/notifications/actions';

const IMAGE_FILE_TYPES = ['jpg', 'jpeg', 'png'];

const useStyles = makeStyles((theme) => ({
  avatarUpload: {
    margin: '0 auto',
    width: theme.custom.components.avatarUploader,
    height: theme.custom.components.avatarUploader,
    color: theme.palette.text.primary,
    fontSize: '30px',
    fontWeight: theme.typography.fontWeightMedium,
    backgroundColor: theme.custom.colors.white,
    border: `1px solid ${theme.palette.text.primary}`,
    cursor: 'pointer',
    position: 'relative',
    zIndex: theme.zIndex.layer1,
  },
  indicatorContainer: {
    position: 'absolute',
    zIndex: 10,
    top: '-2px',
    left: 0,
  },
  avatarUploaderContainer: {
    width: theme.custom.components.avatarUploader,
    height: theme.custom.components.avatarUploader,
    margin: '0 auto',
    position: 'relative',
  },
}));

const AvatarUploader = ({
  onLoadingChange,
  onUpload,
  value,
  shouldHaveIndicator,
}) => {
  const classes = useStyles();

  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const fileInputElem = useRef();

  const handleUploadClick = (event) => {
    event.preventDefault();
    fileInputElem.current.click();
  };

  useEffect(() => {
    onLoadingChange(isLoading);
  }, [isLoading, onLoadingChange]);

  const handleChange = async (event) => {
    setIsLoading(true);

    const { files } = event.target;
    if (files.length === 0) {
      return;
    }

    try {
      const result = await core.utils.requestAPI({
        path: ['uploads', 'avatar'],
        method: 'POST',
        data: [...files].reduce((acc, file) => {
          acc.append('files', file, file.name);
          return acc;
        }, new FormData()),
      });

      onUpload(result.data.url);
    } catch (error) {
      dispatch(
        notify({
          text: translate('AvatarUploader.errorAvatarUpload'),
          type: NotificationsTypes.ERROR,
        }),
      );
    }

    setIsLoading(false);
  };

  const fileTypesStr = IMAGE_FILE_TYPES.map((ext) => {
    return mime.getType(ext);
  }).join(',');

  return (
    <Fragment>
      <Box className={classes.avatarUploaderContainer}>
        {shouldHaveIndicator && (
          <Box className={classes.indicatorContainer}>
            <GroupWalletCircleSVG width={94} />
          </Box>
        )}
        <Avatar
          className={classes.avatarUpload}
          src={isLoading ? null : value}
          onClick={handleUploadClick}
        >
          {isLoading ? <CircularProgress /> : '+'}
        </Avatar>
        <input
          accept={fileTypesStr}
          ref={fileInputElem}
          style={{ display: 'none' }}
          type="file"
          onChange={handleChange}
        />
      </Box>
    </Fragment>
  );
};

AvatarUploader.propTypes = {
  onLoadingChange: PropTypes.func.isRequired,
  onUpload: PropTypes.func.isRequired,
  shouldHaveIndicator: PropTypes.bool,
  value: PropTypes.string,
};

export default AvatarUploader;
