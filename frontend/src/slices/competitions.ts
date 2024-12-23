import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Competition {
  id: number;
  name: string;
  description: string;
  code: number;
  start_date: string;
  end_date: string;
  joined: boolean;
}

interface CompetitionsState {
  competitions: Competition[];
}

const initialState: CompetitionsState = {
  competitions: [],
};

const competitionsSlice = createSlice({
  name: 'competitions',
  initialState,
  reducers: {
    setCompetitions(state, action: PayloadAction<Competition[]>) {
      state.competitions = action.payload;
    },
    resetCompetitions: () => initialState,
  },
});

export const { setCompetitions, resetCompetitions } = competitionsSlice.actions;
export default competitionsSlice.reducer;
