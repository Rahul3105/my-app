import { TextField, Button } from "@mui/material";
import { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom"; 
const Signup = () => {
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
            let res = await axios.post("http://localhost:1234/signup", form);
            if (!res.error) { 
                ///store token is localStorage
                localStorage.setItem('user_token', JSON.stringify(res.data.token))
                ///re-direct to home page
                return history.replace('/my-drive')
            }
        } catch (err) {
            console.log(err.message)
        }
    }
    return <div>
        <TextField  label="First name" variant="outlined"  onChange={updateForm} name="first_name"/>
        <TextField  label="Last name" variant="outlined"  onChange={updateForm} name="last_name"/>
        <TextField  label="Email" variant="outlined" onChange={updateForm}  name="email"/>
        <TextField  label="Password" variant="outlined"  onChange={updateForm} name="password"/>
        <Button variant="outlined" onClick = {postForm}>Signup</Button>
    </div>
}
export default Signup;