import { Box } from '@mui/material';
import { ethers } from 'ethers';
import jazzicon from 'jazzicon';
import PropTypes from 'prop-types';
import React, { createRef, useEffect } from 'react';

const Jazzicon = ({ size = 50, ...props }) => {
  const ref = createRef();

  useEffect(() => {
    const seed = ethers.BigNumber.from(props.address.slice(0, 15)).toNumber();
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
