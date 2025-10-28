import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  id: number | null;
  name: string;
  email: string;
  password: string;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  id: 1,
  name: 'Naveenkesav',
  email: 'naveenkeshav9@gmail.com',
  password: 'password',
  isAuthenticated: true,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(
      state,
      action: PayloadAction<{
        id: number;
        name: string;
        email: string;
        password: string;
      }>
    ) {
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.password = action.payload.password;
      state.isAuthenticated = true;
    },
    logoutUser(state) {
      state.id = null;
      state.name = '';
      state.email = '';
      state.password = '';
      state.isAuthenticated = false;
    },
  },
});
export const { setUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;
