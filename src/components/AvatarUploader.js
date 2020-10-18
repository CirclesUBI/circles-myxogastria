import PropTypes from 'prop-types';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import mime from 'mime/lite';
import { Avatar, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';

import core from '~/services/core';
import notify, { NotificationsTypes } from '~/store/notifications/actions';
import translate from '~/services/locale';

const IMAGE_FILE_TYPES = ['jpg', 'jpeg', 'png'];

const useStyles = makeStyles((theme) => ({
  avatarUpload: {
    margin: '0 auto',
    width: theme.spacing(15),
    height: theme.spacing(15),
    color: theme.palette.text.primary,
    fontSize: '30px',
    fontWeight: theme.typography.fontWeightMedium,
    backgroundColor: 'transparent',
    border: `1px solid ${theme.palette.text.primary}`,
    cursor: 'pointer',
    transform: 'rotate(90deg)',
  },
}));

const AvatarUploader = ({ onLoadingChange, onUpload, value }) => {
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
    </Fragment>
  );
};

AvatarUploader.propTypes = {
  onLoadingChange: PropTypes.func.isRequired,
  onUpload: PropTypes.func.isRequired,
  value: PropTypes.string,
};

export default AvatarUploader;
