import { useState, useEffect } from "react";
import axios from "axios";
const useDirectory = (dir_id = null) => {
  const [dirID, setDirID] = useState(null);
  const [state, setState] = useState();

  useEffect(() => {
    setDirID(dir_id);
  }, [dir_id]);

  useEffect(() => {
    if (dirID) {
      let token = localStorage.getItem("user_token");
      axios
        .get(`http://localhost:1234/my-directory/${dirID}`, {
          headers: { authentication: `bearer ${token}` },
        })
        .then((res) => {
          setState(res.data.directory);
        })
        .catch((err) => {
          setState(err.message);
        });
    }
  }, [dirID]);

  const addSubDirectory = async (payload) => {
    try {
      let res = await axios.post(
        "http://localhost:1234/my-directory/directory",
        payload
      );
      setState(res.data);
    } catch (err) {
      console.log(err.message);
    }
  };
  return { state, addSubDirectory, setDirID };
};
export { useDirectory };
