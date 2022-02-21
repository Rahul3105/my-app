import { useState, useEffect } from "react";
import axios from "axios";
const api_url = "https://salty-sands-70108.herokuapp.com/api"


const useDirectory = (dir_id = null) => {
  const [dirID, setDirID] = useState(null);
  const [state, setState] = useState();
  const [error, setError] = useState(null)

  useEffect(() => {
    setDirID(dir_id);
  }, [dir_id]);

  useEffect(() => {
    if (dirID) {
      let token = localStorage.getItem("user_token");
      axios
        .get(`${api_url}/my-directory/${dirID}`, {
          headers: { authentication: `bearer ${token}` },
        })
        .then((res) => {
          setState(res.data.directory);
        })
        .catch((err) => {
          setError(err.message);
        });
    }
  }, [dirID]);

  const addSubDirectory = async (id, payload) => {
    try {
      let token = localStorage.getItem("user_token");
      let res = await axios.patch(
        `${api_url}/my-directory/directory/create/${id}`,
        payload, {
        headers: { authentication: `bearer ${token}` },
      }
      );
      setState(res.data.directory);
    } catch (err) {
      console.log(err.message);
    }
  };
  const addFile = async (id, payload) => {
    try {
      let token = localStorage.getItem("user_token");
      let res = await axios.patch(`${api_url}/my-directory/file/create/${id}`, payload, {
        headers: { authentication: `bearer ${token}` },
      });
      setState(res.data.directory)
    } catch (err) {
      console.log(err.message)
    }
  }
  const removeSubDirectory = async (id) => {
    try {
      let token = localStorage.getItem("user_token");

      let res = await axios.delete(`${api_url}/my-directory/directory/${id}`, {
        headers: { authentication: `bearer ${token}` },
      });
      setState(res.data.directory)
    } catch (err) {
      console.log(err.message)
    }
  }
  const removeFile = async (id, parent) => {
    try {
      let token = localStorage.getItem("user_token");

      let res = await axios.delete(`${api_url}/my-directory/file/${id}`, { data: { parent }, headers: { authentication: `bearer ${token}` } })

      setState(res.data.directory)
    } catch (err) {
      console.log(err.message)
    }
  }

  const renameSubDirectory = async (id, payload) => {
    try {
            let token = localStorage.getItem("user_token");

      let res = await axios.patch(`${api_url}/my-directory/directory/rename/${id}`, payload, {
        headers: { authentication: `bearer ${token}` },
      });
      
      setState(res.data.directory)
    } catch (err) {
      console.log(err.message)
    }
  }


  const renameFile = async (id, payload) => {
    try {
                  let token = localStorage.getItem("user_token");

      let res = await axios.patch(`${api_url}/my-directory/file/rename/${id}`, payload,  {
        headers: { authentication: `bearer ${token}` },
      });
      setState(res.data.directory)
    } catch (err) {
      console.log(err.message)
    }
  }
  const moveDir = async (id, payload) => {
    try {
      let token = localStorage.getItem("user_token");

      let res = await axios.patch(`${api_url}/my-directory/directory/move/${id}`, payload, {
        headers: { authentication: `bearer ${token}` },
      });
      
      setState(res.data.directory)
    } catch (err) {
      console.log(err.message)
    }
  }

  const moveFile = async (id, payload) => {
    try {
      let token = localStorage.getItem("user_token");
      let res = await axios.patch(`${api_url}/my-directory/file/move/${id}`, payload, {
        headers: { authentication: `bearer ${token}` },
      });
      setState(res.data.directory)
    } catch (err) {
      console.log(err.message)
    }
  }


  const directoryOrganize = async (id) => {
    try {
      let token = localStorage.getItem("user_token");

      let res = await axios.patch(`${api_url}/my-directory/directory/organize/${id}`, null, {
        headers: { authentication: `bearer ${token}` },
      });
      setState(res.data.directory);
    } catch (err) {
      console.log(err.message)
    }
  }
  return { state, addSubDirectory, setDirID, addFile, removeSubDirectory, removeFile, renameSubDirectory, renameFile, moveDir, moveFile, directoryOrganize , error, setError};
};
export { useDirectory };
