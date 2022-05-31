import { Button, Stack, TextField, Typography } from "@mui/material";
import papaparse from "papaparse";
import { useState } from "react";
import { appContext } from "../AppContext";
import { uploadCSV } from "../firebase";

const UploadCSV = () => {
  const [file, setFile] = useState(null);
  const [eventNameError, setEventNameError] = useState("");
  const { events } = appContext();
  const handleSubmit = (e) => {
    e.preventDefault();
    const eventName = e.target[0].value;
    setEventNameError(
      events.find((event) => event.eventName === eventName)
        ? `Eventname ${eventName} already taken`
        : ""
    );
    papaparse.parse(file, {
      header: false,
      skipEmptyLines: "greedy",
      complete: async function (results) {
        const { data } = results;
        const csvData = data.map(([firstName, lastName]) => ({
          firstName,
          lastName,
          currentProgress: {
            from: 0,
            to: 0,
          },
        }));
        csvData.shift(); // remove header
        await uploadCSV(eventName, csvData);
        e.target.reset();
      },
    });
  };
  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      width={"80%"}
      spacing={4}
    >
      <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
        Setup your event
      </Typography>
      <Typography variant="p" component="div" sx={{ flexGrow: 1 }}>
        Use the form below to upload a list of guests.
        <a href="/users.csv" download>
          Click here
        </a>
        for an example template.
      </Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            required
            label="Enter Event Name"
            variant="standard"
            error={!!eventNameError}
            helperText={eventNameError}
          />
          <div>
            <label>Select CSV File</label>
            <input
              type="file"
              id="file"
              accept="*.csv"
              required
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>
          <Button variant="contained" type="submit">
            Submit
          </Button>
        </Stack>
      </form>
    </Stack>
  );
};

export default UploadCSV;
