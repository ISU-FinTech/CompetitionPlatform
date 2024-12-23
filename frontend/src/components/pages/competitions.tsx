import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../store"; 
import Competitor from "./components/competitions/competitor";
import Admin from "./components/competitions/admin";

function Competitions() {
  const userInfo = useSelector((state: RootState) => state.auth.user); 

  const userRole = userInfo?.role;

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{ marginTop: 4, marginX: "auto" }}
    >
      {userRole === 'admin' ? (
        <Admin />
      ) : (
        <Competitor />
      )}
    </Box>
  );
}

export default Competitions;
