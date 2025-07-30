import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userId: null,
  email: null,
  islogedin : false
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login(state){
      state.islogedin = true ;
    },
    setUser(state, action) {
      state.userId = action.payload.userId;
      state.email = action.payload.email;
    },
    clearUser(state) {
      state.userId = null;
      state.email = null;
    },
  },
});

export const { setUser, clearUser , login } = userSlice.actions;

export default userSlice.reducer;
