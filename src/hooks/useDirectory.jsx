import { useState, useEffect } from "react";
import axios from "axios";
import apiURL from '../apiURL';


const useDirectory = (dir_id = null, handleOpen) => {
  const [dirID, setDirID] = useState(null);
  const [state, setState] = useState();
  const [error, setError] = useState(null)

  useEffect(() => {
    setDirID(dir_id);
  }, [dir_id]);

  useEffect(() => {
    if (dirID) {
      handleOpen(true)
      let token = localStorage.getItem("user_token");
      axios
        .get(`${apiURL}/my-directory/directory/${dirID}`, {
          headers: { authentication: `bearer ${token}` },
        })
        .then((res) => {
          handleOpen(false)
          setState(res.data.directory);
        })
        .catch((err) => {
          handleOpen(false)
          setError(err.message);
        });
    }
  }, [dirID]);

  const addSubDirectory = async (id, payload) => {
    try {
      handleOpen(true)
      let token = localStorage.getItem("user_token");
      let res = await axios.patch(
        `${apiURL}/my-directory/directory/create/${id}`,
        payload, {
        headers: { authentication: `bearer ${token}` },
      }
      );
      handleOpen(false)
      setState(res.data.directory);
    } catch (err) {
      handleOpen(false)
      console.log(err.message);
    }
  };
  const addFile = async (id, payload) => {
    try {
      handleOpen(true)
      let token = localStorage.getItem("user_token");
      let res = await axios.patch(`${apiURL}/my-directory/file/create/${id}`, payload, {
        headers: { authentication: `bearer ${token}` },
      });
      handleOpen(false)
      setState(res.data.directory)
    } catch (err) {
      handleOpen(false)
      console.log(err.message)
    }
  }
  const removeSubDirectory = async (id) => {
    try {
      handleOpen(true)
      let token = localStorage.getItem("user_token");

      let res = await axios.delete(`${apiURL}/my-directory/directory/${id}`, {
        headers: { authentication: `bearer ${token}` },
      });
      handleOpen(false)
      setState(res.data.directory)
    } catch (err) {
      handleOpen(false)
      if (err.message === "Request failed with status code 405") {
        alert(" Directory is not empty😓")
      }
      console.log(err.message)
    }
  }
  const removeFile = async (id, parent) => {
    try {
      handleOpen(true)
      let token = localStorage.getItem("user_token");

      let res = await axios.delete(`${apiURL}/my-directory/file/${id}`, { data: { parent }, headers: { authentication: `bearer ${token}` } })
      handleOpen(false)
      setState(res.data.directory)
    } catch (err) {
      handleOpen(false)
      console.log(err.message)
    }
  }

  const renameSubDirectory = async (id, payload) => {
    try {
      handleOpen(true)
            let token = localStorage.getItem("user_token");

      let res = await axios.patch(`${apiURL}/my-directory/directory/rename/${id}`, payload, {
        headers: { authentication: `bearer ${token}` },
      });
      handleOpen(false)
      setState(res.data.directory)
    } catch (err) {
      handleOpen(false)
      console.log(err.message)
    }
  }


  const renameFile = async (id, payload) => {
    try {
      handleOpen(true)
      let token = localStorage.getItem("user_token");

      let res = await axios.patch(`${apiURL}/my-directory/file/rename/${id}`, payload,  {
        headers: { authentication: `bearer ${token}` },
      });
      handleOpen(false)
      setState(res.data.directory)
    } catch (err) {
      handleOpen(false)
      console.log(err.message)
    }
  }
  const moveDir = async (id, payload) => {
    try {
      handleOpen(true)
      let token = localStorage.getItem("user_token");

      let res = await axios.patch(`${apiURL}/my-directory/directory/move/${id}`, payload, {
        headers: { authentication: `bearer ${token}` },
      });
      handleOpen(false)
      setState(res.data.directory)
    } catch (err) {
      handleOpen(false)
      console.log(err.message)
    }
  }

  const moveFile = async (id, payload) => {
    try {
      handleOpen(true)
      let token = localStorage.getItem("user_token");
      let res = await axios.patch(`${apiURL}/my-directory/file/move/${id}`, payload, {
        headers: { authentication: `bearer ${token}` },
      });
      handleOpen(false)
      setState(res.data.directory)
    } catch (err) {
      handleOpen(false)
      console.log(err.message)
    }
  }


  const directoryOrganize = async (id) => {
    try {
      handleOpen(true)
      let token = localStorage.getItem("user_token");

      let res = await axios.patch(`${apiURL}/my-directory/directory/organize/${id}`, null, {
        headers: { authentication: `bearer ${token}` },
      });
      handleOpen(false)
      setState(res.data.directory);
    } catch (err) {
      handleOpen(false)
      console.log(err.message)
    }
  }
  const copyDirectory = async (id, payload) => {
    try {
      handleOpen(true)
      let token = localStorage.getItem("user_token");
      let res = await axios.patch(`${apiURL}/my-directory/directory/copy/${id}`, payload, {
        headers: { authentication: `bearer ${token}` },
      })
      handleOpen(false)
      setState(res.data.directory);
    } catch (err) {
      handleOpen(false)
      console.log(err.message)
    }   
  }
  const copyFile = async (id, payload) => {
    try {
      handleOpen(true)
      let token = localStorage.getItem("user_token");
       let res = await axios.patch(`${apiURL}/my-directory/file/copy/${id}`, payload, {
        headers: { authentication: `bearer ${token}` },
       })
      handleOpen(false)
      setState(res.data.directory)
    } catch (err) {
      handleOpen(false)
      console.log(err.message)
    }
  }
  return { state, addSubDirectory, setDirID, addFile, removeSubDirectory, removeFile, renameSubDirectory, renameFile, moveDir, moveFile, directoryOrganize , error, setError, copyDirectory, copyFile};
};
export { useDirectory };
