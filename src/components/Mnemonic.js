import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

const StyledSeedContainer = styled.ol`
  flex-wrap: wrap;
  list-style: none;
  margin: 0;
  padding: 0 16px;
`;

const StyledSeedItem = styled.li.attrs((props) => ({
  data: props.data + 1,
}))`
  background: #fff;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  display: inline-block;
  margin-bottom: 16px;
  margin-left: 9px;
  padding: 8px;
  position: relative;
  text-align: left;
  white-space: pre;
  width: calc(33.3% - 9px);

  &:nth-child(3n + 1) {
    margin-left: 0;
  }

  &:before {
    content: attr(data);
    margin-right: 4px;
    opacity: 0.4;
  }
`;

const Mnemonic = ({ text }) => (
  <StyledSeedContainer>
    {text.split(' ').map((word, index) => {
      return (
        <StyledSeedItem data={index} key={index} xs={3}>
          {word + ' '}
        </StyledSeedItem>
      );
    })}
  </StyledSeedContainer>
);

Mnemonic.propTypes = {
  text: PropTypes.string.isRequired,
};

export default Mnemonic;
