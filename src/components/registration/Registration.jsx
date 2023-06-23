import React, { useState } from 'react'
import Cookies from 'universal-cookie'
import '../login/login.css'
import { registrationFetch } from '../../helpers/registrationFetch'
import { Title } from '../Title'



export const Registration = () => {

    let page = 'createAccount'; 

    const cookies = new Cookies();


    const [formState, setFormState] = useState({
        name: '',
        email: '',
        password: ''
      })
    
      const {email, password, name} = formState;
    
      const onInputchange = async({target})=>{
        const {name, value} = target;
        await setFormState({
                ...formState,
                [name]: value       
        }) 
      }


      const onSubmit = async(event)=>{
        event.preventDefault();
            registrationFetch(name, password, email)
      }

    return (
      <div className='pb-5 body-bg form-container'>

        <Title />
        <div className='form-wrapper '>
            <form 
            className='login-form'
            onSubmit={onSubmit}
            >
            <div className="mb-3">
                <label className="form-label">Nombre</label>
                <input 
                type="text" 
                className="form-control" 
                placeholder='Tu nombre' 
                name='name'
                value={name}
                onChange={onInputchange}
                />
            </div>
            <div className="mb-3">
                <label htmlFor="exampleInputEmail1" className="form-label">E-mail</label>
                <input 
                type="email" 
                className="form-control" 
                id="exampleInputEmail1" 
                aria-describedby="emailHelp"
                placeholder='Tu mail' 
                name='email'
                value={email}
                onChange={onInputchange}
                />
                
            </div>
            <div className="mb-3">
                <label htmlFor="exampleInputPassword1" className="form-label">Contraseña</label>
                <input 
                type="password" 
                className="form-control" 
                id="exampleInputPassword1"
                placeholder='Tu contraseña'
                name='password'
                value = {password}
                onChange = {onInputchange}
                
                />
            </div>
            <button type="submit" className="btn btn-primary create-account__button">Crear cuenta</button>
            </form>
            <a href="/" className='pb-3 font-weight-light'>Ya tienes cuenta? Inicia sesión</a>        
        </div>
            <div id='errorMsg' className='text-center mt-3' ></div>
        </div>
      )
    }
