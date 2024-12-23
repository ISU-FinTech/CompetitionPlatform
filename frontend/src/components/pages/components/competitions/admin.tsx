import { Box, Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import { useState } from "react";
import { CreateEvent, GetEvents } from "./events";
import AddIcon from "@mui/icons-material/Add";

const Admin = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mt: 5,
      }}
    >
      <GetEvents />

      <Button
        variant="outlined"
        color="secondary"
        startIcon={<AddIcon />}
        onClick={handleDialogOpen}
        sx={{ margin: 6 }}
      >
        Create Event
      </Button>

      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Create a New Event</DialogTitle>
        <DialogContent>
          <CreateEvent onClose={handleDialogClose} />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Admin;
