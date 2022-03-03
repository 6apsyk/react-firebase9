import React, { useEffect } from 'react'
import "./App.css";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";

let unsubUser = null;

function Header({ auth }) {


  //Подписка на авторизированного пользователя
  useEffect(() => {
    unsubUser = onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        console.log('User status change:', user)
        console.log('uid', uid)
      } else {
        // User is signed out
        // ...
        console.log('User is signed out:', user)
      }
    });
    return () => {
      console.log('отписка')
      unsubUser()
    }

  }, [])

  // const onUnsibsrizing = () => {
  //   if (unsubUser) {
  //     console.log('отписка')
  //     unsubUser()
  //   }
  // }

  // Регистрация
  const submitSingUp = (e) => {
    e.preventDefault()

    createUserWithEmailAndPassword(auth, e.target.email.value, e.target.password.value)
      .then((userCredential) => {
        const user = userCredential.user;
        // console.log(user)
      })
      .catch((error) => {
        console.log(error.message)
      });
  }

  // Вход
  const submitLogin = (e) => {
    e.preventDefault()

    signInWithEmailAndPassword(auth, e.target.email.value, e.target.password.value)
      .then((userCredential) => {
        const user = userCredential.user;
        // console.log(user)
      })
      .catch((error) => {
        console.log(error.message)
      });
  }

  //Выход
  const onLogout = () => {
    signOut(auth).then(() => { }).catch(error => console.log(error.message))
  }

  return (
    <div className='header'>
      <h1>Firebase9</h1>
      <form onSubmit={submitSingUp} className="sing">
        <label>email:</label>
        <input type="email" name="email" required />
        <label>Password:</label>
        <input type="text" name="password" required />
        <button>Sing Up</button>
      </form>

      <form onSubmit={submitLogin} className="login">
        <label>email:</label>
        <input type="email" name="email" required />
        <label>Password:</label>
        <input type="text" name="password" required />
        <button>Login</button>
      </form>

      <button onClick={onLogout}>Log Out</button>
      {/* <button onClick={onUnsibsrizing}>Отменить подписку на авторизированного пользователя</button> */}

    </div>
  )
}

export default Header