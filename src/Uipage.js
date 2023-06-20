import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPassenger, updatePassenger, editPassenger, cancelEdit, deletePassenger } from "./action";
import { Button, Checkbox, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import TablePagination from "@mui/material/TablePagination";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';



function Uipage() {
  const [selectedPassengers, setSelectedPassengers] = useState([]);
  const [name, setName] = useState("");
  const [trips, setTrips] = useState("");
  const [airline, setAirline] = useState("");
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name"); // Initial sorting column
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedCount, setSelectedCount] = useState(0);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [selectedPassengerId, setSelectedPassengerId] = useState(null)
  
 

  const dispatch = useDispatch();
  const passengers = useSelector((state) => state.passengers.data) || [];
  console.log(passengers , " passengerss .. ")
  const sortedPassengers = passengers.slice().sort(getComparator(order, orderBy));
  console.log(sortedPassengers , "new data passenger")


  const fetchData = async () => {
    try {
      await dispatch(fetchPassenger());
    } catch (error) {
      console.log(error.message);
    }
  };
  


  const handleEdit = (passengerId) => {
    dispatch(editPassenger(passengerId));
  };

  const handleCancelEdit = (passengerId) => {
    dispatch(cancelEdit(passengerId));
  };

  
  const handleDelete = () => {
    if (selectedPassengers.length === 0) return; 
    setSelectedPassengerId(selectedPassengers[0]);
    setSelectedPassengers([]); // Clear selected passengers
    setSelectedCount(0);
  };

  const handleConfirmDelete = async (selectedPassengerId) => {
    if (!selectedPassengerId) return; 
    await dispatch(deletePassenger(selectedPassengerId));
    setSelectedPassengerId(null); 
    setSelectedPassengers([]); 
    setSelectedCount(0);
    // await dispatch(fetchPassenger()); 
  };
  


  const handleUpdate = async (id) => {
    const data = {
      name: name,
      trips: trips,
      airline: airline
    };
    console.log(id, "id from ui page");
    if (id) {
      await dispatch(updatePassenger(id, data, airline));
      setName("");
      setTrips("");
      setAirline("");
      console.log(data, "new data");
      console.log(airline, "AIRLINE new data");
      alert("DATA UPDATED SUCCESSFULLY");

      await dispatch(fetchPassenger());
    } else {
      console.log("Invalid passenger id");
    }
  };


  const handleSelectAllClick = (event) => {
    const selectAll = event.target.checked;
    setIsSelectAll(selectAll);
    const currentPassengers = sortedPassengers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);  // Get the passengers on the current page
    setSelectedPassengers(selectAll ? currentPassengers.map((passenger) => passenger._id) : []);
    setSelectedCount(selectAll ? currentPassengers.length : 0)
  };



  const handleSelectPassenger = (passengerId) => {
    if (selectedPassengers.includes(passengerId)) {
      setSelectedPassengers(selectedPassengers.filter((id) => id !== passengerId));
      setSelectedCount(selectedCount - 1); // Decrease count when passenger is unselected
    } else {
      setSelectedPassengers([...selectedPassengers, passengerId]);
      setSelectedCount(selectedCount + 1); // Increase count when passenger is selected
    }
    setIsSelectAll(false);
  };




  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  function getComparator(order, orderBy) {
    switch (orderBy) {
      case "name":
        return order === 'desc'
          ? (a, b) => descendingComparator(a, b, orderBy)
          : (a, b) => -descendingComparator(a, b, orderBy);
      case "trips":
      case "airline":
      default:
        return (a, b) => 0;
    }
  }

  const handleRequestSort = (column) => {
    const isAsc = orderBy === column && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(column);
  };

 
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };


  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  return (
    <div>
      <h1>PASSENGERS DETAILS LIST</h1>
      <div>Selected Passengers: {selectedCount}</div>
      <Button onClick={fetchData}>FETCH PASSENGER DATA</Button>
    
      <Tooltip title="Delete">
        <IconButton onClick={() => handleDelete(selectedPassengerId)} disabled={selectedPassengers.length === 0}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
        {selectedPassengerId && (
        <>
          <Button onClick={()=>handleConfirmDelete(selectedPassengerId)}>Confirm Delete</Button>
          <Button onClick={() => setSelectedPassengerId(null)}>Cancel Delete</Button>
        </>
      )}




      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>

              <TableCell onClick={() => handleRequestSort("name")}>
                Name {orderBy === "name" && (
                  <span>
                    {order === "asc" ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
                  </span>
                )}
              </TableCell>


              <TableCell>Trips</TableCell>
              <TableCell>Main ID</TableCell>
              <TableCell>Airline ID</TableCell>
              <TableCell>Airline Name</TableCell>
              <TableCell>Airline Country</TableCell>
              <TableCell>Airline Country ID</TableCell>
              <TableCell>Action</TableCell>

              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  indeterminate={selectedPassengers.length > 0 && selectedPassengers.length < passengers.length}
                  checked={isSelectAll}
                  onChange={handleSelectAllClick}
                  inputProps={{
                    "aria-label": "select all passengers"
                  }}
                />
              </TableCell>

            </TableRow>
          </TableHead>
          <TableBody>
            {sortedPassengers.length > 0 ? (
              sortedPassengers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((passenger) => (
                  <TableRow key={passenger._id}>
                    {passenger.isEdit ? (
                      <>
                        <TableCell>
                          <TextField
                            type="text"
                            placeholder="NAME"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            type="text"
                            placeholder="TRIPS"
                            value={trips}
                            onChange={(e) => setTrips(e.target.value)}
                          />
                        </TableCell>


                        <TableCell>
                          <TextField
                            type="text"
                            placeholder="ID"
                            value={airline}
                            onChange={(e) => setAirline(e.target.value)}
                          />
                        </TableCell>


                        <TableCell>{passenger._id}</TableCell>
                        <TableCell colSpan={5}></TableCell>
                        <TableCell>
                          <Button onClick={() => handleCancelEdit(passenger._id)}>CANCEL</Button>
                        </TableCell>
                        <TableCell>
                          <Button onClick={() => handleUpdate(passenger._id)}>DONE</Button>
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell>{passenger.name}</TableCell>
                        <TableCell>{passenger.trips}</TableCell>
                        <TableCell>{passenger._id}</TableCell>
                        <TableCell>{passenger.airline[0].id}</TableCell>
                        <TableCell>{passenger.airline[0].name}</TableCell>
                        <TableCell>{passenger.airline[0].country}</TableCell>
                        <TableCell>{passenger.airline[0]._id}</TableCell>
                        <TableCell padding="checkbox">
                          <Checkbox
                            color="primary"
                            checked={selectedPassengers.includes(passenger._id)}
                            onChange={() => handleSelectPassenger(passenger._id)}
                            inputProps={{ "aria-labelledby": passenger._id }}
                          // onClick={() => handleEdit(passenger._id)}
                          />
                        </TableCell>
                        <TableCell>
                          <Button onClick={() => handleEdit(passenger._id)}>EDIT</Button>
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={9}>No passengers found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={passengers.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
    </div>
  );
}

export default Uipage;
