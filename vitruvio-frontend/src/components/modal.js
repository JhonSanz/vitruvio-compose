import '@/styles/modal.css'
import { useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';


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
    maxHeight: "90%",
    bgcolor: 'background.paper',
    border: '1px solid #000',
    boxShadow: 24,
    p: 4,
    overflowY: "scroll"
  };

  return (
    <Modal
      open={isOpen}
      onClose={() => setIsOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2"></Typography>
        {children}
      </Box>
    </Modal>
  )
}

export default ModalApp;