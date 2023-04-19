import { Box } from '@mui/material';
import jazzicon from 'jazzicon';
import PropTypes from 'prop-types';
import React, { createRef, useEffect } from 'react';

import web3 from '~/services/web3';

const Jazzicon = ({ size = 50, ...props }) => {
  const ref = createRef();

  useEffect(() => {
    const seed = web3.utils.hexToNumber(props.address.slice(0, 15));
    const { firstChild: identiconElem } = jazzicon(size, seed);
    identiconElem.setAttribute('width', size);
    identiconElem.setAttribute('height', size);
    ref.current.innerHTML = '';
    ref.current.appendChild(identiconElem);
  }, [ref, props.address, size]);

  return <Box ref={ref}></Box>;
};

Jazzicon.propTypes = {
  address: PropTypes.string.isRequired,
  size: PropTypes.number,
};

export default React.memo(Jazzicon);
