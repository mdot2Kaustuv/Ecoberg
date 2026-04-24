import React from 'react'

const LoginorRegister = (props) => {
  return (
   <>
   
    <a className={`btn ${props.class}`} href={`/${props.text.toLowerCase()}`}>
      {props.text}
    </a>
   
   
   
   </>
  )
}

export default LoginorRegister