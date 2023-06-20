import axios from 'axios'

export const fetchPassenger = () => {
    console.log('inside fetch passenger');
    return (dispatch) => {
      axios
        .get('https://api.instantwebtools.net/v1/passenger?page=0&size=10')
        .then((response) => {
          console.log(response.data, 'getdata');
          dispatch({
            type: 'FETCH_PASSENGER_SUCCESS',
            payload: response.data,
          });
        })

        .catch((error) => {
          console.log(error.message);
          dispatch({
            type: 'FETCH_PASSENGER_FAILURE',
            payload: error.message,
          });
        });
    };
  };



  export const updatePassenger = (id, data, airline) => {
    console.log(id, "new data from update passenger");
    console.log(data, "data from action");
    console.log(airline, "airline data");
  
    return dispatch => {
      axios.put(`https://api.instantwebtools.net/v1/passenger/${id}`, { ...data, airline })
        .then(response => {
          console.log(response.data, 'data update successfully');
  
          dispatch({
            type: 'UPDATE_PASSENGER_SUCCESS',
            payload: response.data,
          });
        })
        .catch(error => {
          console.log(error.message);
          dispatch({
            type: 'UPDATE_PASSENGER_FAILURE',
            payload: error.message,
          });
        });
    };
  };

  export const deletePassenger = (selectedPassengerId) => {
    console.log(selectedPassengerId , " id ...")
  return dispatch => {
    dispatch({
     type: 'DELETE_PASSENGER',
     payload: selectedPassengerId
  })  
}} 
  

  export const editPassenger = (passengerId) => {
    return {
      type: 'EDIT_PASSENGER',
      payload: passengerId,
    };
  };

  export const cancelEdit = (passengerId) => {
    return {
      type: 'CANCEL_EDIT',
      payload: passengerId,
    };
  };

  // export const deletePassenger = (passengerId) => ({
  //   type: 'DELETE_PASSENGER',
  //   payload: passengerId,
  // });

 
  
  
  
  
