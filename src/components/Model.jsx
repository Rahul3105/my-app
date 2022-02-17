import * as React from 'react';
import Box from '@mui/material/Box';

import Modal from '@mui/material/Modal';
import { TextField, Button } from "@mui/material";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function BasicModal({toggleModel, updateDirName, addDir}) {
  return (
      <Modal
        open={true}
        onClose={toggleModel}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
            <TextField label="Folder Name" variant="outlined" name="directory_name" onChange={ updateDirName }/>
            <Button variant="outlined" onClick={ addDir }>Create</Button>
        </Box>
      </Modal>
  );
}