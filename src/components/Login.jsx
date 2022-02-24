import { TextField, Button } from "@mui/material";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { useHistory ,Link} from "react-router-dom"; 
import StyledForm from './StyledForm';
import apiURL from '../apiURL'

const Login = () =>
{
    const [form, setForm] = useState({});
    const history = useHistory()
    useEffect(() => {
        if (localStorage.getItem('user_token')) {
            history.replace('/my-drive')
        } 
    },[])
    const updateForm = (e) => {
        let payload = {
            ...form,
            [e.target.name] : e.target.value
        }
        setForm(payload)
    }
    const postForm = async () => {
        try {
            let res = await axios.post(`${apiURL}/login`, form);
            if (!res.error) { 
                ///store token in localStorage
                localStorage.setItem('user_token', JSON.stringify(res.data.token))
                ///re-direct to home page
                return history.replace('/my-drive')
            }
        } catch (err) {
            console.log(err.message)
        }
    }
    return <StyledForm>
        <h1>Login</h1>
        <div>
        <TextField  label="Email" variant="outlined" onChange={updateForm}  name="email"/>
        </div>
        <div>    
        <TextField label="Password" variant="outlined" onChange={updateForm} name="password" />
        </div>
        <Button variant="outlined" onClick={postForm}>Login</Button>
        <p>Create an account<Link to={"/signup"}>Signup</Link></p>
    </StyledForm>
}

export default Login;