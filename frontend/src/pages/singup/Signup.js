import {useState} from 'react'
import { UseSignUp } from '../../hooks/UseSignUp';
import { Oval } from 'react-loader-spinner'
import './Singup.css'
import { NavLink } from 'react-router-dom';


export const Signup = ()=>{

    const[email, setEmail] = useState('');
    const[password, setPassword] = useState('');
    const[name, setName] = useState('');

    const{error, loading, signup} = UseSignUp();

    const handleSubmit = async(e)=>{

        e.preventDefault();

        await signup(name, email, password);
 
        
    }

    return (

       
        <div id="RegisterContainer">

            {loading &&  (

            <Oval
            visible={true}
            height="80"
            width="80"
            color="black"
            margin="auto"
            ariaLabel="oval-loading"
            wrapperStyle={{}}
            wrapperClass="loader"
            />
            )}

            {!loading && <div id="RegisterFormContainer">
                <h2>Register Here</h2>
                
                <form onSubmit={handleSubmit}>
                    <input type="text" name="name" value={name} onChange={(e)=> setName(e.target.value)} placeholder='Your Name please' /> 
                    <input type="email" name="email" value={email} onChange={(e)=> setEmail(e.target.value)} placeholder='Your email please' />
                    <input type="password" name="password" value={password} onChange={(e)=> setPassword(e.target.value)} placeholder='Your password please' />
                    <button disabled={loading} type='submit' id="signupBtn">Register</button>
                </form>
                <p style={{fontSize:'13PX'}}>Not Registered? 
                    <span >
                     <NavLink style={{color:'#8a8a8f', cursor:'pointer', textDecoration:'none', marginLeft:'5px'}} to='/login'>Login</NavLink>
                    </span>
                </p>
                {error && <div className='signup_error'>{error}</div>}
                
                    
              
            </div>}

       </div>
        
       
    )
}