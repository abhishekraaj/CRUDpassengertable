const initialState = {
    passengers: [],
    error: null,
    loading: true,
    isEdit: false
};

const rootReducer = (state = initialState, action) => {
    switch (action.type) {

        case 'FETCH_PASSENGER_SUCCESS':
            console.log('reducer', action.payload);
            return {
                ...state,
                passengers: action.payload,
                loading: false,
                error: null,
            };

        case 'FETCH_PASSENGER_FAILURE':
            return {
                ...state,
                passengers: [],
                error: action.payload,
            };

        case 'POST_PASSENGER_SUCCESS':
            console.log()
            return {
                ...state,
                passengers: [...state.passengers, action.payload],
                error: null
            }

        case 'POST_PASSENGER_FAILURE':
            return {
                ...state,
                error: action.payload
            }


        case 'UPDATE_PASSENGER_SUCCESS':
            console.log('update reducer', action.payload);

            return {
                ...state,
                passengers: {
                    ...state.passengers,
                    data: state.passengers.data.map((passenger) =>
                        passenger._id === action.payload._id ? action.payload : passenger
                    ),
                },
                loading: false,
                error: null,
                isEdit: false
            };

        case 'UPDATE_PASSENGER_FAILURE':
            return {
                ...state,
                error: action.payload,
            };

        // case 'DELETE_PASSENGER':
        //     console.log("Hello from reducer-users")
        //     console.log(state.passengers.data, " hii...")
        //     const filteredPassenger = state.passengers.data.filter(
        //         (passenger) => passenger.id !== action.payload
        //     );
        //     return {
        //         ...state,
        //         passengers: filteredPassenger,
        //         error: null,
        //     }

        case 'DELETE_PASSENGER':
            console.log("Hello from reducer-users");
            console.log(state.passengers.data, "hii...");
            const filteredPassenger = state.passengers.data.filter(
              (passenger) => passenger._id !== action.payload
            );
            console.log(filteredPassenger, "deleted");
            return {
              ...state,
              passengers: {
                ...state.passengers,
                data: filteredPassenger,
              },
              error: null,
            };
          

        case 'EDIT_PASSENGER':
            return {
                ...state,
                passengers: {
                    ...state.passengers,
                    data: state.passengers.data.map((passenger) =>
                        passenger._id === action.payload ? { ...passenger, isEdit: true } : passenger
                    ),
                },
                isEdit: true,
            };

        case 'CANCEL_EDIT':
            return {
                ...state,
                passengers: {
                    ...state.passengers,
                    data: state.passengers.data.map((passenger) =>
                        passenger._id === action.payload ? { ...passenger, isEdit: false } : passenger
                    ),
                },
                isEdit: false,
            };






        default:
            return state;

    }
}
export default rootReducer;
