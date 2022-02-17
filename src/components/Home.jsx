import Navbar from "./navbar";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import Model from './Model';

import { useHistory, useParams } from 'react-router-dom';
import { useDirectory } from '../hooks/useDirectory'
const Home = () => {
  const {id} = useParams ()
  const [userInfo, setUserInfo] = useState();
  const { state: directory, addSubDirectory,  setDirID } = useDirectory(id)
  const [modelOpen, setModelOpen] = useState(false);
  const [newDirectoryName, setNewDirectoryName] = useState("");
  const history = useHistory()
  
  useEffect(() => {
    let token = localStorage.getItem("user_token");
    axios
    .get("http://localhost:1234/user", { headers: { "authentication": `bearer ${token}` } })
      .then((res) => {
        setUserInfo(res.data.user);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);
  
  useEffect(() => {
    if (!id && userInfo) setDirID(userInfo.root_directory);
  }, [userInfo])

  
  const updateDirName = (e) => setNewDirectoryName(e.target.value);
  const openDir = (id) => {
    history.push(`/my-drive/${id}`)
  }
  const addDir = async () => {
    let payload = {
      directory_name: newDirectoryName,
      parent: directory._id,
      user: userInfo._id,
    }
    await addSubDirectory(payload)
  }
  const toggleModel = () => setModelOpen(!modelOpen)
  console.log(directory)
  return (
    <div>
      {modelOpen && <Model toggleModel={toggleModel} updateDirName={updateDirName} addDir={addDir} />}
      <Navbar user_name={userInfo?.first_name} />
      {directory && directory.path}
      <Button variant="contained" onClick={toggleModel}>Add Folder</Button>
      <Button variant="contained">Add File</Button>
      <div>
        {directory && directory.sub_directories.map(dir => {
          return <Button variant="outlined" key={dir._id} onClick={() => openDir(dir._id)}>{dir.directory_name}</Button>
        })}
      </div> 
    </div>
  );
};
export default Home;



