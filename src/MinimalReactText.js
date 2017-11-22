import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class MinimalReactText extends Component {
  constructor(props) {
    super(props);

    let hasValue = false;
    let hasError = false;
    const isFocused = false;
    const inputValue = props.inputValue;

    if (inputValue !== '' && typeof inputValue !== 'undefined') {
      hasValue = true;
      hasError = props.hasError || (props.pattern && !props.pattern.test(inputValue));
    }

    this.state = {
      hasValue,
      hasError,
      inputValue,
      isFocused
    };
  }

  shouldComponentUpdate (nextProps, nextState) {
    const propsTocheck = [ 'inputValue', 'id', 'isDisabled', 'isRequired', 'placeholder', 'hasError', 'data-event-action', 'wrapperClasses', 'inputClasses', 'labelClasses', 'errortextClasses'];

    for ( let key in nextState ) {
      if (this.state[key] !== nextState[key]) {
        return true;
      }
    }

    for (let i = 0 ; i<propsTocheck.length; i++) {
      let propToCheck = propsTocheck[i];
      if (this.props[propToCheck] !== nextProps[propToCheck]) {
        return true;
      }
    }
    return false;
  }

  componentWillReceiveProps(nextProps) {
    let hasError = nextProps.hasError;
    let hasValue = !!nextProps.inputValue || this.state.hasValue;
    const inputValue = (nextProps.inputValue !== undefined ? nextProps.inputValue : this.state.inputValue);

    if (!hasError && inputValue !== '' && typeof inputValue !== 'undefined' && !!nextProps.pattern) {
      hasValue = true;
      hasError = (nextProps.pattern && !nextProps.pattern.test(inputValue));
    }
    this.setState({ hasValue, hasError, inputValue });
  }

  onBlur(event) {
    this.setState({
      isFocused: false
    });

    const { pattern, isRequired } = this.props;
    let hasError;

    this.setState({
        hasValue: Boolean(event.currentTarget.value),
        hasError: (event.currentTarget.value.length ? (pattern && !pattern.test(event.currentTarget.value)) : isRequired)
    });

    // update on this.setState happens after this functions is completed
    // in order to avoid that 'skipped' change of value, I use the
    // hasError variable
    hasError = (event.currentTarget.value.length ? (pattern && !pattern.test(event.currentTarget.value)) : isRequired);

    if (this.props.onBlur) {
      this.props.onBlur(event, this, hasError);
    } else if (this.props.onChange) {
      this.props.onChange(event, this, hasError);
    }
 }

  onChange(event) {
    this.setState({
      hasValue: Boolean(event.currentTarget.value),
      inputValue: event.currentTarget.value,
      hasError: false
  });

  if (this.props.onChange) {
    this.props.onChange(event, this);
  }
 }

  onFocus(event) {
    this.setState({
      isFocused: true
    });

    if (this.props.onFocus) {
      this.props.onFocus(event, this);
    }
  }

  render() {
    const {
      errorTextMessage,
      id,
      isDisabled,
      isRequired,
      label,
      placeholder,
      theme,
      type } = this.props;

    const { hasValue, hasError, inputValue, isFocused } = this.state;

    const wrapperClasses = classNames(
      'tx-wrapper',
      this.props.wrapperClasses,
      { 'tx-focused': isFocused },
      { 'tx-disabled': isDisabled },
      { 'tx-wrapper-white': theme === 'dark' });

    const inputClasses = classNames(
      'tx-input',
      this.props.inputClasses );

    const labelClasses = classNames(
      'tx-label',
      this.props.labelClasses,
      { 'tx-above': placeholder || hasValue || isFocused });

    const errortextClasses = classNames(
      'tx-errortext',
      this.props.errortextClasses,
      { 'tx-errortext-visible': hasError });

    const fieldRequiredMessage = 'Field is required';

    return (
      <div className={wrapperClasses}>
        <div>
          <input
            autoComplete={this.props.autoComplete}
            className={inputClasses}
            disabled={isDisabled}
            id={id}
            required={isRequired}
            value={inputValue || ''}
            data-event-action={this.props['data-event-action']}
            min={this.props.min}
            name={this.props.inputName}
            placeholder={placeholder}
            onKeyPress={this.props.onKeyPress}
            onFocus={this.onFocus.bind(this)}
            tabIndex={this.props.tabIndex || "0"}
            onBlur={this.onBlur.bind(this)}
            onChange={this.onChange.bind(this)}
            type={type}
          />
          {label ? <label className={labelClasses}
            htmlFor={id}
                   >
            {label}
          </label> : null}
        </div>
        {(errorTextMessage || isRequired) ?
          <p className={errortextClasses}>
          {inputValue ? errorTextMessage : fieldRequiredMessage}
          </p> : null}
      </div>
    );
 }
}

MinimalReactText.defaultProps = {
  autoComplete: false,
  isDisabled: false,
  theme: 'normal',
  type: 'text'
};

if (process.env.NODE_ENV !== 'production') {
  MinimalReactText.propTypes = {
    'autoComplete': PropTypes.bool,
    'wrapperClasses': PropTypes.string,
    'inputClasses': PropTypes.string,
    'labelClasses': PropTypes.string,
    'errortextClasses': PropTypes.string,
    'data-event-action': PropTypes.string,
    'id': PropTypes.string,
    'inputName': PropTypes.string,
    'inputValue': PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number]),
    'isDisabled': PropTypes.bool,
    'isRequired': PropTypes.bool,
    'min': PropTypes.number,
    'onChange': PropTypes.func,
    'pattern': PropTypes.any,
    'placeholder': PropTypes.string,
    'theme': PropTypes.string,
    'hasError': PropTypes.bool,
    'type': PropTypes.string,
    'tabIndex': PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number]),
    'onKeyPress': PropTypes.func
  };
}

export default MinimalReactText;
