import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Stack, Typography } from "@mui/material";
import { appContext } from "../AppContext";
import { deleteEvent } from "../firebase";
import { Link } from "react-router-dom";

const columns = [
  { field: "eventName", headerName: "Event Name", width: 230 },
  { field: "timeStamp", headerName: "Created At", width: 230 },
  {
    field: "delete",
    headerName: "Delete",
    sortable: false,
    renderCell: (params) => {
      const handleClick = (event, params) => {
        event.stopPropagation();
        deleteEvent(params.id);
      };

      return (
        <Button
          variant="outlined"
          color="error"
          onClick={(event) => handleClick(event, params)}
        >
          Delete
        </Button>
      );
    },
  },
  {
    field: "edit",
    headerName: "Edit",
    sortable: false,
    renderCell: (params) => {
      return (
        <Button component={Link} to={`/events/${params.id}`} variant="outlined">
          Edit
        </Button>
      );
    },
  },
];

export default function EventsTable() {
  const { events } = appContext();
  const data = events.map((event) => {
    return {
      ...event,
      timeStamp: new Date(event.createdAt?.toDate()).toLocaleString(),
    };
  });

  return (
    <Stack justifyContent="center" alignItems="center" width={"80%"}>
      <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
        List of current events
      </Typography>
      <div style={{ height: 400, width: "80%" }}>
        <DataGrid
          rows={data}
          columns={columns}
          pageSize={7}
          disableColumnMenu={true}
          disableMultipleSelection={true}
        />
      </div>
    </Stack>
  );
}
