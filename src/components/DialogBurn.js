import PropTypes from 'prop-types';
import React from 'react';
import { useDispatch } from 'react-redux';

import Dialog from '~/components/Dialog';
import translate from '~/services/locale';
import { burnApp } from '~/store/app/actions';

const DialogBurn = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();

  const handleBurn = () => {
    onClose();
    dispatch(burnApp());
  };

  return (
    <Dialog
      cancelLabel={translate('DialogBurn.dialogBurnCancel')}
      confirmLabel={translate('DialogBurn.dialogBurnConfirm')}
      id="burn"
      open={isOpen}
      text={translate('DialogBurn.dialogBurnDescription')}
      title={translate('DialogBurn.dialogBurnTitle')}
      onClose={onClose}
      onConfirm={handleBurn}
    />
  );
};

DialogBurn.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
};

export default DialogBurn;
