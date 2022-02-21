import Navbar from "./navbar";
import { Button, Menu, MenuItem } from "@mui/material";
import styled from "styled-components"
import { useEffect, useState } from "react";
import ArticleIcon from '@mui/icons-material/Article';
import axios from "axios";
import FolderIcon from '@mui/icons-material/Folder';
import Model from './Model';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import { useHistory, useParams } from 'react-router-dom';
import { useDirectory } from '../hooks/useDirectory';
import PasteItemBtn from './PasteItemBtn';
const api_url = "https://salty-sands-70108.herokuapp.com/api"

const Home = () => {
  const { id } = useParams()
  const [userInfo, setUserInfo] = useState();
  const { state: directory, addSubDirectory, setDirID, addFile, removeSubDirectory, removeFile, renameSubDirectory,renameFile , moveDir, moveFile, directoryOrganize } = useDirectory(id)
  const [modelOpen, setModelOpen] = useState(false);
  const [openModelForRenameDir, setOpenModelForRenameDir] = useState(false);
  const [openModelForRenameFile, setOpenModelForRenameFile] = useState(false);
  const [newDirectoryName, setNewDirectoryName] = useState("");
  const [currDirForRename, setCurrDirForRename]  = useState("");
  const history = useHistory();
  // const [openMenu, setOpenMenu] = useState(false);

  useEffect(() => {
    let token = localStorage.getItem("user_token");
    axios
      .get(`${api_url}/users`, { headers: { "authentication": `bearer ${token}` } })
      .then((res) => {
        setUserInfo(res.data.user);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  useEffect(() => {
    if (!id && userInfo) setDirID(userInfo.root_directory);
  }, [userInfo,id])


  const updateDirName = (e) => setNewDirectoryName(e.target.value);
  const openDir = (id) => {
    history.push(`/my-drive/${id}`)
  }
  const addDir = async () => {
    let payload = {
      directory_name: newDirectoryName,
    }
    await addSubDirectory(directory._id, payload)
  }
  const uploadFile = async (e) => {
    let file = e.target.files[0];
    let form = new FormData();
    form.append('file', file);
    await addFile(directory._id, form);
  }
  const deleteDir = async (id) => {
    await removeSubDirectory(id)
  }
  const deleteFile = async (id) => {
    await removeFile(id, directory._id);
  }
  const renameDirectoryHelper = async () => {
    let payload = {
      directory_name : newDirectoryName
    }
    await renameSubDirectory(currDirForRename, payload);
    setNewDirectoryName("")
  }
  const renameFileHelper = async () => {
    let payload = {
      file_name: newDirectoryName,
      parent : directory._id
    }
    await renameFile(currDirForRename, payload);
    setNewDirectoryName("");
  }
  const moveHelper = async (callback) => {
    let {id, parentID, itemType} = JSON.parse(localStorage.getItem("copiedItemID"))
    localStorage.removeItem("copiedItemID");
    let payload = { 
      newParentID: directory._id,
      prevParentID: parentID
    }
    await itemType === 'dir' ? moveDir(id, payload) : moveFile(id, payload)
  }
  const storeIDInLC = (id,itemType) => {
    localStorage.setItem("copiedItemID",JSON.stringify({ id, parentID : directory._id, itemType }));
  }

  console.log(directory)
  const toggleModel = () => setModelOpen(!modelOpen)
  // const toggleMenu = (e) => {
  //   e.stopPropagation()
  //   setOpenMenu(!openMenu)
  // }
  
  return (
    <StyledHome>
      {modelOpen && <Model toggleModel={toggleModel} updateDirName={updateDirName} addDir={addDir} />}
      {openModelForRenameDir && < Model toggleModel={() => setOpenModelForRenameDir(!openModelForRenameDir) } updateDirName={updateDirName} addDir={ renameDirectoryHelper }/>}
      {openModelForRenameFile && < Model toggleModel={() => setOpenModelForRenameFile(!openModelForRenameFile)} updateDirName={updateDirName} addDir={ renameFileHelper }/>}
      <Navbar user_name={userInfo?.first_name} />
      <div className="controls">
        <h3>{directory && directory.path}</h3>
        <div>
        <PasteItemBtn moveHelper={moveHelper} />
        <Button variant="contained" onClick={ () => directoryOrganize(directory._id) }>Organize Folder</Button>
        <Button variant="contained" onClick={toggleModel}>Add Folder</Button>

        <Button variant="contained" component="label">Add File
          <input
            id="fileInput"
            type="file"
            style={{ display: 'none' }}
            onChange={uploadFile}
          />
          </Button>
        </div>
      </div>
      <div className="fileAndFolderCont">
        {directory && directory.sub_directories.map(dir => {
          return <div key={dir._id} className="fileOrFolder">
            <Button variant="outlined" onClick={() => openDir(dir._id)}><FolderIcon />{dir.directory_name} </Button>
            <div>
              <DeleteIcon onClick={() => deleteDir(dir._id)} />
              <ContentCutIcon onClick={ ( ) => storeIDInLC(dir._id, "dir")}/>
              <ContentCopyIcon />
              <DriveFileRenameOutlineIcon onClick={() =>{
                setCurrDirForRename(dir._id)                
                setOpenModelForRenameDir(!openModelForRenameDir)}} />
            </div>
          </div>
        })}
        {directory && directory.files.map(file => {

          return <div key={file._id} className="fileOrFolder">
            <Button variant="outlined" key={file._id} ><ArticleIcon/>{file.file_name}  </Button>
            <div>
              <DeleteIcon onClick={() => deleteFile(file._id)} />
              <ContentCutIcon onClick={ ( ) => storeIDInLC(file._id, "file")}/>
              <ContentCopyIcon />
              <DriveFileRenameOutlineIcon onClick={() =>{
                setCurrDirForRename(file._id)                
                setOpenModelForRenameFile(!openModelForRenameFile)
              }}
              />
            </div>
          </div>
        })}
      </div>
      {/* <Menu open ={openMenu}>
        <MenuItem>Cut</MenuItem>
        <MenuItem>Delete</MenuItem>
        <MenuItem>Rename</MenuItem>
      </Menu> */}
    </StyledHome>
  );
};
const StyledHome= styled.div`

& > .controls {
  display:flex;
  padding:10px 20px;
  justify-content:space-between;
}
& > .fileAndFolderCont {
  
  display:flex;
  .fileOrFolder {
    min-width:120px;
    margin:20px;
   
    div {
      
      margin-top:5px;
     
      display:flex;
      justify-content: space-between;
    }
  }
  flex-wrap: wrap; 
}

`

export default Home;



