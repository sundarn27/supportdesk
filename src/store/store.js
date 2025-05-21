import { configureStore } from '@reduxjs/toolkit';
import commonReducer from '../features/commonSlice'; 
import masterReducer from '../features/masterSlice'; 
import ticketReducer from '../features/ticketSlice'; 
import mailReducer from '../features/mailSlice'; 

const store = configureStore({
  reducer: {
    common: commonReducer,
    master: masterReducer,
    ticket: ticketReducer,
    mail: mailReducer,
  },
});

export default store;
