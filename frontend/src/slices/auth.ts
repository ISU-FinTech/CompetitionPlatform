import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  email: string;
  username: string;
  role: string;
  id: number
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ email: string; role: string; username: string; id: number; }>) => {
      state.isAuthenticated = true;
      state.user = { email: action.payload.email, role: action.payload.role, username: action.payload.username, id: action.payload.id };
      //state.token = action.payload.token;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      //state.token = null;
    },
    setUser: (state, action: PayloadAction<{ email: string; role: string; username: string; id: number;  }>) => {
      state.user = action.payload;
    },
  },
});

export const { login, logout, setUser } = authSlice.actions;
export default authSlice.reducer;
