import React, { useState } from 'react'
import Cookies from 'universal-cookie'
import '../login/login.css'
import { registrationFetch } from '../../helpers/registrationFetch'



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
      <div className='pb-5 body-bg'>

        <h3 className='text-center mb-5'>Create Account</h3>
        <div className='form-wrapper '>
            <form 
            className='login-form'
            onSubmit={onSubmit}
            >
            <div className="mb-3">
                <label className="form-label">Name</label>
                <input 
                type="text" 
                className="form-control" 
                placeholder='Your name' 
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
                placeholder='Your mail' 
                name='email'
                value={email}
                onChange={onInputchange}
                />
                <div id="emailHelp" className="form-text">Do not share this information with anyone.</div>
            </div>
            <div className="mb-3">
                <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                <input 
                type="password" 
                className="form-control" 
                id="exampleInputPassword1"
                placeholder='Your password'
                name='password'
                value = {password}
                onChange = {onInputchange}
                
                />
            </div>
            <button type="submit" className="btn btn-primary create-account__button">Create Account</button>
            </form>
        </div>
            <div id='errorMsg' className='text-center mt-3' ></div>
        </div>
      )
    }
