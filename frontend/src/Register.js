import React from 'react';

import request from './request';


class Register extends React.Component {

  constructor(props) {
    super(props);


    this.usernameInput = null;
    this.passwordInput = null;

    this.onSubmit = this.onSubmit.bind(this);

  }

  async onSubmit() {

    if (this.usernameInput.value.length === 0) {
      console.log('invalid username')
      return;
    }

    if (this.passwordInput.value.length === 0) {
      console.log('invalid password')
      return;
    }

    if (this.passwordInput.value !== this.passwordVerify.value) {
      alert('passwords do not match');
    }
    
    let response = await request({
      method: 'POST',
      form: true,
      body: {
        _utf8: '✓',
        'user[password]': this.passwordInput.value,
        'user[email]': this.usernameInput.value,
        'user[username]': this.usernameInput.value
      },
      url: '/users'
    })

    if (response.includes('User created successfully.')) {
      console.log('User made')
    }
    else {
      alert('failed to make user');
    }

    this.props.back(); 

  }

  render() {
    return (

        <div className="register-container">
          <div className="register-title">Register a New User!</div>
          <div className="form-group">
              <label className="control-label" for="user_email">Username</label>
              <input ref={(element) => {this.usernameInput = element}} className="form-control" id="user_email" name="user[email]" type="text" />
          </div>

          <div className="form-group">
              <label className="control-label" for="user_username">Password</label>
              <input  ref={(element) => {this.passwordInput = element}} className="form-control" id="user_username" name="user[username]" type="password" />
          </div>

          <div className="form-group">
              <label className="control-label" for="user_username">Password Again</label>
              <input  ref={(element) => {this.passwordVerify = element}} className="form-control" id="user_username" name="user[username]" type="password" />
          </div>

          <div className="form-group">
              <button onClick ={this.onSubmit} className="btn btn-primary" type="submit">
                Submit
              </button>
          </div>
        </div>
    );
  }

}

export default Register;