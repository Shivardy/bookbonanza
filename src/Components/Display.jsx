import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import {
  Autocomplete,
  Button,
  Stack,
  TableFooter,
  TextField,
  Typography,
} from "@mui/material";
import { actionTypes, appContext } from "../AppContext";
import { getEventUsers } from "../firebase";
import { useCallback, useEffect, useState } from "react";

export default function Display() {
  const { events, users, dispatch } = appContext();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [activePage, setactivePage] = useState(1);
  const [displayCount, setDisplayCount] = useState(10);
  const total = users.length;
  let totalPages = Math.ceil(total / displayCount);

  const getDisplayData = useCallback(() => {
    const data = users.slice(
      (activePage - 1) * displayCount,
      activePage * displayCount
    );
    return data;
  }, [activePage, displayCount, users]);

  const [displayData, setDisplayData] = useState([]);
  const [showTable, setShowTable] = useState(false);

  useEffect(() => {
    setDisplayData(getDisplayData());
  }, [getDisplayData, users]);

  useEffect(() => {
    const myInterval = setInterval(function () {
      setactivePage(activePage >= totalPages ? 1 : activePage + 1);
    }, 5000);

    return () => {
      clearInterval(myInterval);
    };
  }, [activePage, totalPages]);

  useEffect(() => {
    if (selectedEvent) {
      const usersStream = getEventUsers(selectedEvent?.id);
      usersStream((users) => {
        dispatch({
          type: actionTypes.FETCH_EVENT_USERS,
          payload: users.map((user) => ({
            ...user,
            eventId: selectedEvent?.id,
          })),
        });
      });
    } else {
      dispatch({
        type: actionTypes.FETCH_EVENT_USERS,
        payload: [],
      });
    }
  }, [dispatch, selectedEvent, selectedEvent?.id]);

  const handleNext = () => {
    setactivePage(activePage >= totalPages ? 1 : activePage + 1);
    setDisplayData(getDisplayData());
  };
  const handlePrev = () => {
    setactivePage(activePage === 1 ? totalPages : activePage - 1);
    setDisplayData(getDisplayData());
  };

  return showTable ? (
    <>
      <Stack
        spacing={5}
        direction="row"
        justifyContent="space-between"
        sx={{ marginInline: "15px" }}
      >
        <div>
          <Typography variant="h5" component="div">
            {`Event: ${selectedEvent.eventName}`}
          </Typography>
          <Typography variant="caption" display="block" gutterBottom>
            Participants are sorted by name
          </Typography>
        </div>
        <Typography variant="h5" component="div">
          {`Total Participants: ${users.length}`}
        </Typography>
      </Stack>

      <Table sx={{ minWidth: 650, border: "1px solid #ccc" }} size="small">
        <TableHead sx={{ backgroundColor: "#d8eef9" }}>
          <TableRow>
            <TableCell sx={{ width: "30%" }}>
              <Typography variant="h6" component="div">
                Full Name
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="h6" component="div">
                Status
              </Typography>
            </TableCell>
            <TableCell align="right">
              <Typography variant="h6" component="div">
                Last Update
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {displayData.map((user) => (
            <TableRow
              key={user.id}
              sx={{
                "&:last-child td, &:last-child th": { border: 0 },
                "&:nth-of-type(even)": {
                  backgroundColor: "#d8eef9c4",
                },
              }}
            >
              <TableCell component="th" scope="row">
                <b>{`${user.firstName} ${user.lastName}`}</b>
              </TableCell>
              <TableCell>
                <b>{`${user.currentProgress?.from} - ${user.currentProgress?.to}`}</b>
              </TableCell>
              <TableCell align="right">
                {new Date(user.updatedAt?.toDate()).toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter
          sx={{ borderTop: "1px solid #ddf", justifyContent: "center" }}
        >
          <TableCell align="center" colSpan={3}>
            <Button variant="text" onClick={handlePrev}>
              Previous
            </Button>
            <Button variant="text" onClick={handleNext}>
              Next
            </Button>
            <Button
              variant="text"
              onClick={handleNext}
              disabled
              sx={{ textTransform: "none" }}
            >
              <Typography>{`Page ${activePage} / ${totalPages}`}</Typography>
            </Button>
          </TableCell>
        </TableFooter>
      </Table>
    </>
  ) : (
    <Stack
      spacing={3}
      justifyContent="center"
      alignItems="center"
      padding="30px"
    >
      <div>
        <Autocomplete
          sx={{ width: 400 }}
          disablePortal
          value={selectedEvent}
          getOptionLabel={(event) => event.eventName}
          onChange={(event, newValue) => {
            setSelectedEvent(newValue);
          }}
          options={events}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Enter Event Name"
              helperText="The participants from the selected event will be displayed"
            />
          )}
        />
      </div>
      <TextField
        sx={{ width: 400, marginBlockEnd: 1 }}
        type="number"
        label="Enter Display Count"
        value={displayCount}
        onChange={(e) => setDisplayCount(+e.target.value)}
        helperText="Enter number of participants to be displayed on screen"
      />
      <Button variant="contained" onClick={() => setShowTable(!showTable)}>
        Submit
      </Button>
    </Stack>
  );
}
