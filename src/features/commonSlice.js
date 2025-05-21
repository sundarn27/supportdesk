import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL;

// Generate UniqueCode
export const generateCode = createAsyncThunk(
  "userData/generateUniqueCode",
  async (label, { rejectWithValue }) => {
    try {
      console.log(label)
      const response = await axios.post(
        `${API_BASE}/api/General/generateCode`,
        label,
        { headers: { "Content-Type": "application/json" } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : "Server Error"
      );
    }
  }
);

const commonSlice = createSlice({
  name: "common",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // Handle GenerateCode
    builder
      .addCase(generateCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateCode.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(generateCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default commonSlice.reducer;
