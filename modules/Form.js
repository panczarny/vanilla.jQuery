/* global Q */
(() => {
  let a;
  const _options = {
    classes: {
      touched: 'touched',
      blurred: 'blurred',
      focused: 'focused'
    },
    validations: {
      /*
      '#inputId': {
        'min-length': [number || function],
        'max-length': [number || function],
        'regex': [regex || function],
        'onValid': function (el, type) {},
        'onInvalid': function (el, type) {}
      }
      */
    },
    onValidForm: function () {},
    onInvalidForm: function () {},
    onSubmit: function (event) {},
    realtime: true
  };

  class Form {
    constructor (el, options) {
      Form._validationTypes = {
        'min-length': function (text, minLength) {
          return Number.isInteger(minLength) ? text.length >= minLength : false;
        },
        'max-length': function (text, maxLength) {
          return Number.isInteger(maxLength) ? text.length <= maxLength : false;
        },
        'regex': function (text, regex) {
          return regex instanceof RegExp ? regex.test(text) : false;
        }
      };
      this.valid = false;
      this.options = Object.assign({}, _options, options);
      this.$el = Q(el);
      this.$inputs = Q(el).find('input:not([type="submit"]), textarea');
      this._addEvents();
    }
    _addEvents () {
      /* eslint-disable indent */
      this.$inputs.forEach(it => {
        Q(it).on('focus', this._onFocus.bind(this))
        .on((this.options.realtime ? 'input' : 'change'), this._onInput.bind(this))
        .on('blur', this._onBlur.bind(this));
      });
      /* eslint-enable indent */
      this.$el.on('submit', this._onSubmit.bind(this));
    }
    _onBlur (e) {
      Q(e.target).removeClass(this.options.classes.focused).addClass(this.options.classes.blurred);
      this._onInput(e);
    }
    _onFocus (e) { Q(e.target).removeClass(this.options.classes.blurred).addClass([this.options.classes.touched, this.options.classes.focused].join(' ')) }
    _onInput (e) { this.validateInput(e.target, false, true) }
    validateInput (el, silent = false, validateForm = false) {
      const inputValid = this._checkInputValidity(el, silent);
      if (validateForm === true) {
        this.validateForm(true, el);
      }
      return inputValid;
    }
    _checkInputValidity (el, silent) {
      let valids = [];
      let validities = [];
      let invalidities = [];
      const validation = this._findValidation(el);
      if (validation) {
        for (let type in Form._validationTypes) {
          const userValidation = validation[type];
          const value = el.value;
          const valid = !validation.required && value.length === 0 ? true : userValidation != null ? (typeof userValidation === 'function' ? userValidation(value) : Form._validationTypes[type].call(null, value, userValidation)) : true;
          if (valid !== undefined) {
            valids.push(valid);
            (valid ? validities : invalidities).push(type);
          }
        }
      }
      const inputValid = valids.length > 0 ? valids.reduce((prev, curr) => prev && curr) : true;
      if (silent === false && inputValid !== undefined) {
        this._inputValidated(el, {validities, invalidities}, inputValid ? validation && validation.onValid : validation && validation.onInvalid);
      }
      return inputValid;
    }
    _findValidation (el) {
      for (let key in this.options.validations) {
        if (Q(el).is(key)) {
          return this.options.validations[key];
        }
      }
    }
    _inputValidated (el, validitiesInvalidities, callback) {
      const {validities, invalidities} = validitiesInvalidities;
      if (validities.length && typeof callback === 'function') {
        callback.call(this, el, validities);
      }
      if (invalidities.length && typeof callback === 'function') {
        callback.call(this, el, invalidities);
      }
    }
    _onSubmit (e) {
      if (this.validateForm()) {
        (() => typeof this.options.onValidForm === 'function' && this.options.onValidForm.call(this))();
        (() => typeof this.options.onSubmit === 'function' && this.options.onSubmit.call(this, e))();
      }
      else {
        e.preventDefault();
        (() => typeof this.options.onInvalidForm === 'function' && this.options.onInvalidForm.call(this))();
      }
    }
    validateForm (silent = false, el = null) {
      let valids = [];
      this.$inputs.forEach(input => ((el !== null && el !== input) || el === null) ? valids.push(this.validateInput(input, silent)) : null);
      return (this.valid = valids.length > 0 ? valids.reduce((prev, curr) => prev && curr) : true);
    }
  }

  const form = function (options = {}) {
    if (this.length === 1) {
      return new Form(this[0], options);
    }
    else {
      return this.map(el => new Form(el), options);
    }
  };

  Q.fn.extend({ form });
})();
