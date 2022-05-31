import { Box } from "@mui/system";
import Container from "@mui/material/Container";
import { AppBar, Toolbar } from "@mui/material";
import { useEffect } from "react";
import { getEvents } from "./firebase";
import { actionTypes, appContext } from "./AppContext";
import Admin from "./Components/Admin";
import { Route, Routes } from "react-router-dom";
import CurrentEvent from "./Components/CurrentEvent";
import GuestForm from "./Components/GuestForm";
import Display from "./Components/Display";

const App = () => {
  const { dispatch } = appContext();

  useEffect(() => {
    const eventStream = getEvents();
    eventStream((events) => {
      dispatch({ type: actionTypes.FETCH_EVENTS, payload: events });
    });
  }, [dispatch]);

  return (
    <Container maxWidth="xl">
      <Box sx={{ height: "100%" }}>
        <AppBar position="static" style={{ marginBottom: "10px" }}>
          <Toolbar style={{ justifyContent: "center" }}>
            <img
              src={`/logo.png`}
              alt="book bonanza"
              loading="lazy"
              style={{ width: "20rem" }}
            />
          </Toolbar>
        </AppBar>
        <Routes>
          <Route path="/" element={<GuestForm />} />
          <Route path="/events/:eventId" element={<CurrentEvent />} />
          <Route path="/admin/" element={<Admin />} />
          <Route path="/display/" element={<Display />} />
        </Routes>
      </Box>
    </Container>
  );
};

export default App;
