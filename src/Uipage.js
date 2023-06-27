import React, { useState , useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPassenger, updatePassenger, editPassenger, cancelEdit, deletePassenger, setFilteredPassengers } from "./action";
import { Button, Checkbox, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import TablePagination from "@mui/material/TablePagination";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { CSVLink, CSVDownload } from "react-csv";
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;



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
  const [selectedPassengerId, setSelectedPassengerId] = useState(null);
  const [filterOpen, setFilterOpen] = useState(true);
  const [selectedAirlineNames, setSelectedAirlineNames] = useState([]);
  const [selectedAirlineCountries, setSelectedAirlineCountries] = useState([]);
  const [sortedFilterPassengers, setSortedFilterPassengers] = useState([]);
  const [sortedPassengerss, setSortedPassengerss] = useState([])

  useEffect(() => {
    console.log(sortedFilterPassengers, "from useEffect");
  }, [sortedFilterPassengers]);
  



  const dispatch = useDispatch();
  const passengers = useSelector((state) => state.passengers.data) || [];
  console.log(passengers, 'old ..')
  const sortedPassengers = passengers.slice().sort(getComparator(order, orderBy));
  const passengersss = useSelector((state) => state.filteredPassengers) || [];
  console.log(passengersss, " passengerss .. ")
  console.log(sortedFilterPassengers, " sorted data wich was filter..")




  const fetchData = async () => {
    try {
      await dispatch(fetchPassenger());

    } catch (error) {
      console.log(error.message);
    }
  };



  // const handleEdit = (passengerId) => {
  //   dispatch(editPassenger(passengerId));
  //   alert("edit will ")
  //   console.log(passengers, " from edit fuction ")
  // }; 

  const handleEdit = (passengerId) => {
    const updatedPassengers = sortedFilterPassengers.map((passenger) =>
      passenger._id === passengerId ? { ...passenger, isEdit: true } : { ...passenger, isEdit: false }
    );
    setSortedFilterPassengers(updatedPassengers);
    dispatch(editPassenger(passengerId));
    alert("Edit will be performed");
    console.log(sortedFilterPassengers, "from edit function");
  };
  

  // const handleCancelEdit = (passengerId) => {
  //   dispatch(cancelEdit(passengerId));
  // };

  const handleCancelEdit = (passengerId) => {
    const updatedPassengers = sortedFilterPassengers.map((passenger) =>
      passenger._id === passengerId ? { ...passenger, isEdit: false } : passenger
    );
    setSortedFilterPassengers(updatedPassengers);
    dispatch(cancelEdit(passengerId));
  };



  // const handleUpdate = async (id) => {
  //   const data = {
  //     name: name,
  //     trips: trips,
  //     airline: airline
  //   };
  //   console.log(id, "id from ui page");
  //   if (id) {
  //     await dispatch(updatePassenger(id, data, airline));
  //     setName("");
  //     setTrips("");
  //     setAirline("");
  //     console.log(data, "new data");
  //     console.log(airline, "AIRLINE new data");
  //     alert("DATA UPDATED SUCCESSFULLY");

  //     await dispatch(fetchPassenger());
  //   } else {
  //     console.log("Invalid passenger id");
  //   }
  // };


  const handleUpdate = async (id) => {
    const data = {
      name: name,
      trips: trips,
      airline: airline
    };
  
    if (id) {
      const updatedPassengers = sortedFilterPassengers.map((passenger) =>
        passenger._id === id ? { ...passenger, ...data, isEdit: false } : passenger
      );

      setSortedFilterPassengers(updatedPassengers);
      await dispatch(updatePassenger(id, data, airline ));
      setName("");
      setTrips("");
      setAirline("");
      console.log(data, "new data");
      console.log(airline, "AIRLINE new data");
      console.log(updatedPassengers , "updatedPassengers...new")
      alert("DATA UPDATED SUCCESSFULLY");
  
      await dispatch(fetchPassenger());
    } else {
      console.log("Invalid passenger id");
    }
  };
  


  const handleSelectAllClick = (event) => {
    const selectAll = event.target.checked;
    setIsSelectAll(selectAll);

    const currentPassengers = sortedFilterPassengers.length > 0
      ? sortedFilterPassengers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      : sortedPassengers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const selectedIds = selectAll ? currentPassengers.map((passenger) => passenger._id) : [];

    setSelectedPassengers(selectedIds);
    setSelectedCount(selectAll ? selectedIds.length : 0);
  };



  const handleSelectPassenger = (passengerId) => {
    if (selectedPassengers.includes(passengerId)) {
      setSelectedPassengers([]);
      setSelectedCount(0);
    } else {
      setSelectedPassengers([passengerId]);
      setSelectedCount(1);
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
    const newOrder = isAsc ? 'desc' : 'asc';

    setOrder(newOrder);
    setOrderBy(column);

    const comparator = getComparator(newOrder, column);
    const sortedPassengers = [...sortedFilterPassengers].sort(comparator);
    setSortedFilterPassengers(sortedPassengers);
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


  const handlefilter = () => {
    setFilterOpen(!filterOpen);
  };





  const [state, setState] = useState({
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
    </Box>
  );

  const handleSearch = () => {
    const filteredPassengers = passengers.filter((passenger) =>
      selectedAirlineNames.includes(passenger.airline[0].name) ||
      selectedAirlineCountries.includes(passenger.airline[0].country)
    );

    const sortedPassengers = filteredPassengers.slice().sort(getComparator(order, orderBy));
    setSortedFilterPassengers([...sortedPassengers]);
    setSelectedCount(0);
    console.log(filteredPassengers);
    console.log(sortedPassengers, "sooooo");
  };


  // const handleSearch = () => {
  //   const filteredPassengers = passengers?.filter((passenger) =>
  //     selectedAirlineNames.includes(passenger.airline[0].name) ||
  //     selectedAirlineCountries.includes(passenger.airline[0].country)
  //   );


  //   const comparator = getComparator(order, orderBy);
  //   const sortedPassengers = filteredPassengers.sort(comparator);
  //   setSortedFilterPassengers([...sortedPassengers]);
  //   setSelectedCount(0);
  //   console.log(filteredPassengers)
  //   console.log(sortedPassengers, " sooooo")
  // };

  // const filteredPassengersWithKey = filteredPassengers.map((el) => ({
  //   ...el,
  //   isEdit: true
  // }))
  // dispatch({
  //   type: 'SET_FILTERED_PASSENGERS',
  //   payload: filteredPassengersWithKey
  // })

  // setFilteredPassengers(filteredPassengers)






  const handleDelete = () => {
    if (selectedPassengers.length === 0) return;

    selectedPassengers.forEach(async (selectedPassengerId) => {
      await dispatch(deletePassenger(selectedPassengerId));
    });

    const updatedFilterPassengers = sortedFilterPassengers.filter(
      (passenger) => !selectedPassengers.includes(passenger._id)
    );

    setSortedFilterPassengers(updatedFilterPassengers);
    setSelectedPassengers([]);
    setSelectedCount(0)

    const remainingPassengers = passengers.filter(
      (passenger) => !selectedPassengers.includes(passenger._id)
    );

    setSortedPassengerss(remainingPassengers);
  };





  return (
    <div>
      <h1>PASSENGERS DETAILS LIST</h1>
      <div>Selected Passengers: {selectedCount}</div>

      <div style={{ display: "flex", justifyContent: "flex-start" }}>
        <CSVLink data={sortedPassengers}>Download me</CSVLink>;
        <CSVDownload data={sortedPassengers} target="_blank" />;
      </div>

      <div>
        FILTER :{['right'].map((anchor) => (
          <React.Fragment key={anchor}>
            <Button onClick={toggleDrawer(anchor, true)}>{anchor}</Button>
            <Drawer anchor={anchor} open={state[anchor]} onClose={toggleDrawer(anchor, false)} style={{ width: '250px' }}>
              {list(anchor)}
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button onClick={handlefilter}>FILTER</button>

                <div>
                  {//right hand side drawer for filter // airline name an airline counry 
                    filterOpen && (
                      <div>
                        <div>
                          <Autocomplete
                            multiple
                            id="airline-name-input"
                            options={Array.from(new Set(passengers.map((passenger) => passenger.airline[0].name)))}
                            disableCloseOnSelect
                            getOptionLabel={(option) => option}
                            renderOption={(props, option, { selected }) => (
                              <li {...props}>
                                <Checkbox
                                  icon={icon}
                                  checkedIcon={checkedIcon}
                                  style={{ marginRight: 8 }}
                                  checked={selected}
                                />
                                {option}
                              </li>
                            )}
                            style={{ width: 300 }}
                            renderInput={(params) => (
                              <TextField {...params} label="Airline Name" />
                            )}
                            onChange={(event, value) => setSelectedAirlineNames(value)}
                            value={selectedAirlineNames}
                          />
                        </div>

                        <Autocomplete
                          multiple
                          id="airline-country-input"
                          options={Array.from(new Set(passengers.map((passenger) => passenger.airline[0].country)))}
                          disableCloseOnSelect
                          getOptionLabel={(option) => option}
                          renderOption={(props, option, { selected }) => (
                            <li {...props}>
                              <Checkbox
                                icon={icon}
                                checkedIcon={checkedIcon}
                                style={{ marginRight: 8 }}
                                checked={selected}
                              />
                              {option}
                            </li>
                          )}
                          style={{ width: 300 }}
                          renderInput={(params) => (
                            <TextField {...params} label="Airline Country" />
                          )}
                          onChange={(event, value) => setSelectedAirlineCountries(value)}
                          value={selectedAirlineCountries}
                        />

                        <button onClick={handleSearch}>SEARCH</button>

                      </div>
                    )}
                </div>

              </div>
            </Drawer>
          </React.Fragment>
        ))}
      </div>

      <div>Current Page: {page + 1}</div>
      <Button onClick={fetchData}>FETCH PASSENGER DATA</Button>

      <Tooltip title="Delete">
        <IconButton onClick={() => handleDelete(selectedPassengerId)} disabled={selectedPassengers.length === 0}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>

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
            {(sortedFilterPassengers && sortedFilterPassengers.length > 0
              ? sortedFilterPassengers
              : sortedPassengers
            )
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
                        <Button onClick={() => handleCancelEdit(passenger._id)}> CANCEL </Button>
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
                        />
                      </TableCell>
                      <TableCell>
                        <Button onClick={() => handleEdit(passenger._id)}>EDIT</Button>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
          </TableBody>

        </Table>
      </TableContainer>


      <TablePagination
        rowsPerPageOptions={[1, 2, 3, 4, 5, 10, 25]}
        component="div"
        count={passengers.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} of ${count} (Page ${page + 1})`
        }
      />

      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
    </div >
  );
}

export default Uipage;
