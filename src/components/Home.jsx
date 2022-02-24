import Navbar from "./navbar";
import { Button } from "@mui/material";
import styled from "styled-components"
import { useEffect, useState } from "react";
import ArticleIcon from '@mui/icons-material/Article';
import axios from "axios";
import FolderIcon from '@mui/icons-material/Folder';
import Model from './Model';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ContentCutIcon from '@mui/icons-material/ContentCut';
// import MoreVertIcon from '@mui/icons-material/MoreVert';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import { useHistory, useParams } from 'react-router-dom';
import { useDirectory } from '../hooks/useDirectory';
import PasteItemBtn from './PasteItemBtn';
import apiURL from '../apiURL';
const Home = () => {
  const { id } = useParams()
  const [userInfo, setUserInfo] = useState();
  const { state: directory, addSubDirectory, setDirID, addFile, removeSubDirectory, removeFile, renameSubDirectory,renameFile , moveDir, moveFile, directoryOrganize, copyDirectory , copyFile} = useDirectory(id)
  const [modelOpen, setModelOpen] = useState(false);
  const [openModelForRenameDir, setOpenModelForRenameDir] = useState(false);
  const [openModelForRenameFile, setOpenModelForRenameFile] = useState(false);
  const [newDirectoryName, setNewDirectoryName] = useState("");
  const [currDirForRename, setCurrDirForRename]  = useState("");
  const history = useHistory();
  const [forceRender, setForceRender] = useState(false);

  useEffect(() => {
    let token = localStorage.getItem("user_token");
    axios
      .get(`${apiURL}/users`, { headers: { "authentication": `bearer ${token}` } })
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
    let { id, parentID, itemType, operation } = JSON.parse(localStorage.getItem("copiedItemID"))
    localStorage.removeItem("copiedItemID");
    if (operation === "copy") {
      await itemType === 'dir' ? copyDirectoryHelper(id) : copyFileHelper(id) 
      return
    }
    let payload = { 
      newParentID: directory._id,
      prevParentID: parentID
    }
    await itemType === 'dir' ? moveDir(id, payload) : moveFile(id, payload)
  }
  const storeIDInLC = (value) => {
    localStorage.setItem("copiedItemID", JSON.stringify(value));
   setForceRender(!forceRender)
  }

  console.log(directory)
  const toggleModel = () => setModelOpen(!modelOpen);

  const copyDirectoryHelper =async  (id) => {
    await copyDirectory(id, { newParentID: directory._id })
  }
  const copyFileHelper = async (id) => {
    await copyFile (id, { newParentID: directory._id })
  }
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
              <ContentCutIcon onClick={ ( ) => storeIDInLC({ id: dir._id, parentID : directory._id, itemType: "dir" , operation: "move"})}/>
              <ContentCopyIcon onClick={ ( ) => storeIDInLC({ id: dir._id, operation:"copy", itemType: "dir"})}/>
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
              <ContentCutIcon onClick={ ( ) => storeIDInLC( { id: file._id, parentID : directory._id, itemType: "file", operation: "move"})}/>
              <ContentCopyIcon onClick={ ( ) => storeIDInLC({ id: file._id, operation:"copy", itemType: "file"})}/>
              <DriveFileRenameOutlineIcon onClick={() =>{
                setCurrDirForRename(file._id)                
                setOpenModelForRenameFile(!openModelForRenameFile)
              }}
              />
            </div>
          </div>
        })}
      </div>
      
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



