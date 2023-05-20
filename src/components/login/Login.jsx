
import { useEffect, useState } from 'react'
import './login.css'
import { loginFetch } from '../../helpers/loginFetch'
import Cookies from 'universal-cookie'


export const Login = () => {
    const page = 'login'
    useEffect(() => {
      const cookies = new Cookies();
      const token = cookies.get("token")
      if(token){
          window.location.href = "./dashboard"
      }

  }, [])
    const [formState, setFormState] = useState({

        email: '',
        password: ''
      })
    
      const {email, password} = formState;
    
      const onInputchange = async({target})=>{
        const {name, value} = target;
        await setFormState({
                ...formState,
                [name]: value       
        }) 
      }


      const onSubmit = async(event)=>{
        event.preventDefault();

            loginFetch(password, email)

            }
      

  return (
    <div className='pb-5 body-bg'>
      <h3 className='text-center mb-5'>Area solo para administradores</h3>
      <div className='form-wrapper d-flex pb-3'>
          <form 
          className='login-form'
          >
          <div className="mb-5">
              <label htmlFor="exampleInputEmail1" className="form-label">E-mail</label>
              <input 
              type="email" 
              className="form-control" 
              id="exampleInputEmail1" 
              aria-describedby="emailHelp"
              placeholder='correo...' 
              name='email'
              value={email}
              onChange={onInputchange}
              />
              <div id="emailHelp" className="form-text">No compartas esta información con nadie.</div>
          </div>
          <div className="mb-3">
              <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
              <input 
              type="password" 
              className="form-control" 
              id="exampleInputPassword1"
              placeholder='contraseña...'
              name='password'
              value = {password}
              onChange = {onInputchange}
              
              />
          </div>
          <button type="submit" className="btn btn-primary button-width" 
          onClick={onSubmit}
          >Iniciar Sesión</button>
          <hr />
          </form>
          <div>
            <a href="/registration">
            <button className="btn btn-success mb-4">Create account</button>
            </a>
          </div>
      </div>
      <div id='errorMsg' className='text-center' ></div>
    </div>
  )
}

