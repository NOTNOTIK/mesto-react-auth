import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import * as auth from '../auth.js';
import './styles/Register.css';

const Register = () => {
  const [formValue, setFormValue] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    calGoal: ''
  })
  const navigate = useNavigate();

  const handleChange = (e) => {
    const {name, value} = e.target;

    setFormValue({
      ...formValue,
      [name]: value
    });
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    if (formValue.password === formValue.confirmPassword){
      auth.register(formValue.username, formValue.password, formValue.email).then((res) => {
        navigate('/sign-in', {replace: true});
        }
      );
    }
  }

  return (
    <div className="register">
      <p className="register__welcome">
        Регистрация
      </p>
      <form onSubmit={handleSubmit} className="register__form">
       
       
        <input id="email" name="email" placeholder='Email' type="email" value={formValue.email} onChange={handleChange} />
       
        <input id="password" name="password" placeholder='Пароль' type="password" value={formValue.password} onChange={handleChange} />
  
        <div className="register__button-container">
          <button type="submit" onSubmit={handleSubmit} className="register__link">Зарегистрироваться</button>
        </div>
      </form>
      <div className="register__signin">
        <p>Уже зарегистрированы?</p>
        <Link to="sign-in" className="register__login-link">Войти</Link>
      </div>
    </div>
  );
}

export default Register;