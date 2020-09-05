import React, { Component } from 'react';
import { connect } from 'react-redux';
import { selectingStock } from '../store/single-stock-store';
import convertToUSD from '../../utils/convert-to-usd';
import { InputContainer } from '../themes/InputContainer';
import { StyledInput } from '../themes/StyledInput';
import { StyledButton } from '../themes/StyledButton';
import { StyledSection } from '../themes/StyledSection';
import { StyledContainer } from '../themes/StyledContainer';

export class Quote extends Component {
  constructor(props) {
    super(props);
    this.state = { symbol: '' };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(evt) {
    this.setState({ symbol: evt.target.value });
  }

  async handleSubmit(evt) {
    evt.preventDefault();
    await this.props.handleSubmit(this.state.symbol);
  }

  render() {
    return (
      <StyledContainer>
        <form onSubmit={this.handleSubmit} onReset={this.handleFormReset}>
          <InputContainer>
            <StyledInput
              name="ticker"
              type="text"
              placeholder="Ticker"
              required="required"
              onChange={this.handleChange}
              value={this.state.symbol}
            ></StyledInput>
            <StyledButton type="submit">Quote</StyledButton>
          </InputContainer>
        </form>
        {this.props.singleStock.price ? (
          <StyledSection>
            {this.props.singleStock.symbol}
            {' @ '}
            {convertToUSD(this.props.singleStock.price)}
          </StyledSection>
        ) : (
          <StyledSection>Price pending...</StyledSection>
        )}
      </StyledContainer>
    );
  }
}

const mapStateToProps = (state) => ({
  singleStock: state.singleStock
});

const mapDispatchToProps = (dispatch) => ({
  handleSubmit: (symbol) => dispatch(selectingStock(symbol))
});

export default connect(mapStateToProps, mapDispatchToProps)(Quote);
