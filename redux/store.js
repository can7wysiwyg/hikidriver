import { configureStore } from '@reduxjs/toolkit';
import authReducer from "./slices/authSlice"
import updateReducer from "./slices/userUpdateSlice"


const store = configureStore({
    reducer: {
        auth: authReducer,
        update: updateReducer,
       
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          immutableCheck: false, // Disable immutability checks
          serializableCheck: false, // Optional: Disable serializability checks
        }),
    
    
    
    });

export default store;