import EventsTable from "./EventsTable";
import UploadCSV from "./UploadCSV";
import { Stack } from "@mui/material";

const Admin = () => {
  return (
    <Stack spacing={5} justifyContent="center" alignItems="center">
      <UploadCSV />
      <EventsTable />
    </Stack>
  );
};

export default Admin;
