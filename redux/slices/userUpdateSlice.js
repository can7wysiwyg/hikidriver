import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ApiUrl } from '../../helpers/ApiUrl';
import * as SecureStore from 'expo-secure-store';





// Async thunk for updating user details (email, phone number, full name)
export const updateUserDetails = createAsyncThunk(
  'update/updateUserDetails',
  async ({ userData, id }, { rejectWithValue }) => {
    try {
      const token = await SecureStore.getItemAsync('accesstoken');
      if (!token) throw new Error('No access token found');

      

      const response = await fetch(`${ApiUrl}/user_info_update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update user details');
      }

      const data = await response.json();
      return data.user; // Assuming the API returns the updated user
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for updating user photo
export const updatePhoto = createAsyncThunk(
  'update/updatePhoto',
  async (photoData, { rejectWithValue }) => {
    try {
      const token = await SecureStore.getItemAsync('accesstoken');
      if (!token) throw new Error('No access token found');

      const response = await fetch(`${ApiUrl}/update_photo`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(photoData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update photo');
      }

      const data = await response.json();
      return data.user; // Assuming the API returns the updated user
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const updateSlice = createSlice({
  name: 'update',
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateUserDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; // Update the user data
      })
      .addCase(updateUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Handle error
      })
      .addCase(updatePhoto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePhoto.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; // Update the user with the new photo
      })
      .addCase(updatePhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Handle error
      });
  },
});

export const { logout } = updateSlice.actions;
export default updateSlice.reducer;
