import React, { useState } from 'react';
import { connect } from 'react-redux';
import { addQuantity } from '../store/single-stock-store';
import convertToUSD from '../../utils/convert-to-usd';
import { InputContainer } from '../themes/InputContainer';
import { StyledInput } from '../themes/StyledInput';
import { StyledButton } from '../themes/StyledButton';
import { StyledSection } from './Quote';

export const Quantity = (props) => {
  const [qty, setQty] = useState(0);

  const handleChange = (evt) => {
    setQty(parseInt(evt.target.value, 10));
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    props.handleSubmit(qty);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <InputContainer>
          <StyledInput
            name="qty"
            placeholder="Quantity"
            type="number"
            onChange={handleChange}
            required="required"
            min="1"
            step="1"
          ></StyledInput>
          <StyledButton disabled={!props.singleStock.price} type="submit">
            Select
          </StyledButton>
        </InputContainer>
      </form>
      {props.singleStock.quantity ? (
        <StyledSection>
          {' '}
          Estimated Total:{' '}
          {convertToUSD(props.singleStock.price * props.singleStock.quantity)}
        </StyledSection>
      ) : (
        <StyledSection>Estimated Total: Pending...</StyledSection>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  singleStock: state.singleStock
});

const mapDispatchToProps = (dispatch) => ({
  handleSubmit: (qty) => dispatch(addQuantity(qty))
});

export default connect(mapStateToProps, mapDispatchToProps)(Quantity);
