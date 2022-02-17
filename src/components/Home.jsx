import Navbar from "./navbar";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import Model from './Model';

import { useHistory, useParams } from 'react-router-dom';
import { useDirectory } from '../hooks/useDirectory'
const Home = () => {
  const { id } = useParams()
  const [userInfo, setUserInfo] = useState();
  const { state: directory, addSubDirectory, setDirID, addFile } = useDirectory(id)
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
  const uploadFile = async (e) => {
    let file = e.target.files[0];
    let form = new FormData();
    form.append('file', file);
    form.append('parent', directory._id);
    await addFile(form);
  }
  console.log(directory)
  const toggleModel = () => setModelOpen(!modelOpen)
  return (
    <div>
      {modelOpen && <Model toggleModel={toggleModel} updateDirName={updateDirName} addDir={addDir} />}
      <Navbar user_name={userInfo?.first_name} />
      {directory && directory.path}
      <Button variant="contained" onClick={toggleModel}>Add Folder</Button>

      <Button variant="contained" component="label">Add File
        <input
          id="fileInput"
          type="file"
          style={{ display: 'none' }}
          onChange={uploadFile}
        />
      </Button>



      <div>
        {directory && directory.sub_directories.map(dir => {
          return <Button variant="outlined" key={dir._id} onClick={() => openDir(dir._id)}>{dir.directory_name}</Button>
        })}
        {directory && directory.files.map(file => {
          return <a href={file} target="_blank" key={file._id}><Button variant="outlined"  >{file}</Button></a>
        })}
      </div>
    </div>
  );
};

export default Home;



