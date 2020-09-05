import React from 'react';
import { connect } from 'react-redux';
import { addQuantity } from '../store/single-stock-store';
import convertToUSD from '../../utils/convert-to-usd';
import { StyledInput } from '../themes/StyledInput';
import { StyledSection } from '../themes/StyledSection';
import { StyledContainer } from '../themes/StyledContainer';

export const Quantity = (props) => {
  const handleChange = (evt) => {
    if (!isNaN(parseInt(evt.target.value, 10))) {
      props.handleChange(parseInt(evt.target.value, 10));
    }
  };

  return (
    <StyledContainer>
      <StyledInput
        name="qty"
        placeholder="Quantity"
        type="number"
        onChange={handleChange}
        required="required"
        min="0"
        default="1"
        step="1"
      ></StyledInput>

      {props.singleStock.quantity ? (
        <StyledSection>
          {' '}
          Estimated Total:{' '}
          {convertToUSD(props.singleStock.price * props.singleStock.quantity)}
        </StyledSection>
      ) : (
        <StyledSection>Estimated Total: Pending...</StyledSection>
      )}
    </StyledContainer>
  );
};

const mapStateToProps = (state) => ({
  singleStock: state.singleStock
});

const mapDispatchToProps = (dispatch) => ({
  handleChange: (qty) => dispatch(addQuantity(qty))
});

export default connect(mapStateToProps, mapDispatchToProps)(Quantity);
