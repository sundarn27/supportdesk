import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL;

// Fetch Mail Data
export const fetchMailData = createAsyncThunk(
  "mailData/fetchMailData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE}/api/General/getMailData`, {
        headers: { "Content-Type": "application/json" },
      });
      console.log(response);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : "Server Error"
      );
    }
  }
);

// Insert Mail details
export const insertMailData = createAsyncThunk(
  "mailData/insertMail",
  async (formData, { rejectWithValue }) => {
    try {
      console.log(formData);
      const response = await axios.post(
        `${API_BASE}/api/General/insertMailData`,
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

// Send Mail
export const sendMail = createAsyncThunk(
  "mail/deleteMailData",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE}/api/General/sendMail`,
        formData,
        { headers: { "Content-Type": "application/json" } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Server Error");
    }
  }
);

const mailSlice = createSlice({
  name: "mail",
  initialState: {
    data: [],
    mailData: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // Handle fetchMailData
    builder
      .addCase(fetchMailData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMailData.fulfilled, (state, action) => {
        state.loading = false;
        state.mailData = action.payload;
      })
      .addCase(fetchMailData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Handle createMailData
    builder
      .addCase(insertMailData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(insertMailData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(insertMailData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    //Handle Send Mail
    builder
      .addCase(sendMail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMail.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(sendMail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default mailSlice.reducer;
