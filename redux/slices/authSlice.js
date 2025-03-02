import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ApiUrl } from "../../helpers/ApiUrl";
import * as SecureStore from "expo-secure-store";

export const initializeAuth = createAsyncThunk(
  "auth/initializeAuth",
  async (_, { dispatch }) => {
    try {
      const token = await SecureStore.getItemAsync("accesstoken");
      if (token) {
        // If we have a token, try to get user details
        await dispatch(getUserDetails());
      }
      return true; // Return true to indicate initialization is complete
    } catch (error) {
      // Even if there's an error, we've still initialized
      return true;
    }
  }
);


export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await fetch(`${ApiUrl}/user_login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData)
        return rejectWithValue({
          type: "LOGIN_ERROR",
          message: errorData.msg || "Login failed",
        });
      }

      const data = await response.json();
      await SecureStore.setItemAsync("accesstoken", data.accesstoken);
      return { user: data.user, token: data.accesstoken };
    } catch (error) {
      return rejectWithValue({
        type: "LOGIN_ERROR",
        // message: 'Network request failed. Please try again later.'
      });
    }
  }
);

export const getUserDetails = createAsyncThunk(
  "auth/getUserDetails",
  async (_, { rejectWithValue }) => {
    try {
      const token = await SecureStore.getItemAsync("accesstoken");
      if (!token) {
        return rejectWithValue({
          type: "AUTH_ERROR",
          // message: 'No access token found'
        });
      }

      const response = await fetch(`${ApiUrl}/auth/user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue({
          type: "AUTH_ERROR",
          message: errorData.message || "Failed to fetch user details",
        });
      }

      const data = await response.json();
      return { user: data.user, token };
    } catch (error) {
      return rejectWithValue({
        type: "AUTH_ERROR",
        message: error.message,
      });
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
    loading: false,
    error: null,
    errorType: null, // Add errorType to track different kinds of errors
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
    clearError: (state) => {
      state.error = null;
      state.errorType = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeAuth.fulfilled, (state) => {
        state.isInitialized = true;
        state.loading = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        state.errorType = action.payload.type;
      })
      .addCase(getUserDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.errorType = null;
      })
      .addCase(getUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(getUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        state.errorType = action.payload.type;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
