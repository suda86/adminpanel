import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/actions';
import { Redirect } from 'react-router-dom';
import './style/signin.css';

class Signin extends Component {
  onFormSubmit(e) {
    e.preventDefault();
    const email = this.refs.email.value;
    const pass = this.refs.pass.value;
    this.props.login(email, pass);
  }

  render() {
    if (this.props.auth) {
      return <Redirect to="/dashboard" />;
    }
    return (
      <div>
        <form className="form" onSubmit={this.onFormSubmit.bind(this)}>
          <input
            className="login-form-input"
            ref="email"
            type="text"
            placeholder="email"
            required
          />
          <input
            className="login-form-input"
            ref="pass"
            type="password"
            placeholder="password"
            required
          />
          {<p style={{color: "red", textAlign: "center"}}>{this.props.error}</p>}
          <input type="submit" className="login-form-submit" value="Login" />
        </form>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    auth: state.authenticated,
    error: state.error
  };
}

export default connect(mapStateToProps, actions)(Signin);
