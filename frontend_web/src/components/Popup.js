import React from 'react'
import { Dialog, DialogTitle, DialogActions } from '@mui/material';

const Popup = ({ open, setOpen, content}) => {
  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
    <DialogTitle><p className='font-bold'>{content}</p></DialogTitle>
    <DialogActions>
      <button onClick={() => setOpen(false)}>
        Close
      </button>
    </DialogActions>
  </Dialog>
  )
}

export default Popup