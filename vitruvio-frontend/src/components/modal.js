import '@/styles/modal.css'
import { useEffect, useRef } from 'react';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';


function ModalApp({
  children,
  setIsOpen,
  isOpen,
  maxWidth = "90%"
}) {
  const ref = useRef(null);
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "90%",
    maxWidth: maxWidth,
    maxHeight: "80%",
    bgcolor: 'background.paper',
    border: '1px solid #000',
    boxShadow: 24,
    p: 4,
    overflowY: "scroll",
    paddingTop: 0
  };

  const headerStyle = {
    position: "sticky",
    top: 0,
    backgroundColor: "$fff",
    zIndex: 999,
    textAlign: "end",
    paddingTop: "10px"
  }

  return (
    <Modal
      open={isOpen}
      // onClose={() => setIsOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2" style={headerStyle}>
          <IconButton aria-label="delete">
            <CloseIcon onClick={() => setIsOpen(false)} />
          </IconButton>
        </Typography>
        {children}
      </Box>
    </Modal>
  )
}

export default ModalApp;