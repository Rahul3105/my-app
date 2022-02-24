import { TextField, Button } from "@mui/material";
import { useState } from "react";
import axios from "axios";
import { useHistory , Link} from "react-router-dom"; 
import StyledForm from './StyledForm'
import apiURL from '../apiURL'
const Signup = ({ handleOpen }) => {
    const [form, setForm] = useState({});
    const history = useHistory()
    const updateForm = (e) => {
        let payload = {
            ...form,
            [e.target.name] : e.target.value
        }
        setForm(payload)
    }
    const postForm = async () => {
        try {
            handleOpen( true )
            let res = await axios.post(`${apiURL}/signup`, form);
            handleOpen( false )
            if (!res.error) { 
                ///store token is localStorage
                localStorage.setItem('user_token', JSON.stringify(res.data.token))
                ///re-direct to home page
                return history.replace('/my-drive')
            }
        } catch (err) {
            handleOpen( false )
            console.log(err.message)
        }
    }
    console.log(form)
    return <StyledForm>
                <h1>Signup</h1>

        <div><TextField  label="First name" variant="outlined"  onChange={updateForm} name="first_name"/></div>
        <div><TextField  label="Last name" variant="outlined"  onChange={updateForm} name="last_name"/></div>
        <div><TextField  label="Email" variant="outlined" onChange={updateForm}  name="email"/></div>
        <div><TextField  label="Password" variant="outlined"  onChange={updateForm} name="password"/></div>
        <Button variant="outlined" onClick={postForm}>Signup</Button>
        <p>Already have an account? login<Link to={"/login"}>Login</Link></p>
    </StyledForm>
}

export default Signup;