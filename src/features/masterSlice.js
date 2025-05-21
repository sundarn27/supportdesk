import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL;

// Fetch Master list
export const fetchMasterList = createAsyncThunk(
  "userData/fetchMasterList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE}/api/General/getMaster`, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : "Server Error"
      );
    }
  }
);


// Create Master details
export const createMaster = createAsyncThunk(
  "userData/createMaster",
  async (formData, { rejectWithValue }) => {
    try {
      console.log(formData)
      const response = await axios.post(
        `${API_BASE}/api/General/createMaster`,
        formData,
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

const masterSlice = createSlice({
  name: "master",
  initialState: {
    data: [],
    masterData: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // Handle fetchMasterList
    builder
      .addCase(fetchMasterList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMasterList.fulfilled, (state, action) => {
        state.loading = false;
        state.masterData = action.payload;
      })
      .addCase(fetchMasterList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Handle createMaster
    builder
      .addCase(createMaster.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMaster.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(createMaster.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default masterSlice.reducer;
