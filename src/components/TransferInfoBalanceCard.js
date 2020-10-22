import PropTypes from 'prop-types';
import React from 'react';

import TransferInfoCard from '~/components/TransferInfoCard';
import translate from '~/services/locale';
import { formatCirclesValue } from '~/utils/format';

const TransferInfoBalanceCard = ({ address, label, balance, ...props }) => {
  return (
    <TransferInfoCard
      address={address}
      label={label}
      text={translate('TransferInfoBalanceCard.bodyTotalBalance', {
        balance: formatCirclesValue(balance),
      })}
      tooltip={translate('TransferInfoBalanceCard.tooltipTotalBalance')}
      {...props}
    />
  );
};

TransferInfoBalanceCard.propTypes = {
  address: PropTypes.string.isRequired,
  balance: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

export default TransferInfoBalanceCard;
