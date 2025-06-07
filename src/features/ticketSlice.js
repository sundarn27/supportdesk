import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL;

// Fetch Master list
export const fetchTicketList = createAsyncThunk(
  "ticketData/fetchTicketList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE}/api/General/getTicket`, {
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
export const createTicket = createAsyncThunk(
  "ticketData/createTicket",
  async ({ data, files }, { rejectWithValue }) => {
    try {
      console.log("Thunk createTicket called with data:", data);
      const formData = new FormData();
      formData.append("data", JSON.stringify(data));
      files.forEach((file) => {
        formData.append("files", file);
      });
      const response = await axios.post(
        `${API_BASE}/api/General/createTicket`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : "Server Error"
      );
    }
  }
);

const ticketSlice = createSlice({
  name: "ticket",
  initialState: {
    data: [],
    ticketData: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // Handle fetchTicketList
    builder
      .addCase(fetchTicketList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTicketList.fulfilled, (state, action) => {
        state.loading = false;
        state.ticketData = action.payload;
      })
      .addCase(fetchTicketList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Handle createTicket
    builder
      .addCase(createTicket.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTicket.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(createTicket.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default ticketSlice.reducer;
