import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Url } from '../types/types';

interface UrlsState {
  urls: Url[];
}

const initialState: UrlsState = {
  urls: [],
};

const urlsSlice = createSlice({
  name: 'urls',
  initialState,
  reducers: {
    addUrl(state, action: PayloadAction<Url>) {
      state.urls.push(action.payload);
      localStorage.setItem('urls', JSON.stringify(state.urls));
    },
    updateVisits(state, action: PayloadAction<{ shortUrl: string; visits: number }>) {
      const url = state.urls.find((url) => url.shortUrl === action.payload.shortUrl);
      if (url) {
        url.visits = action.payload.visits;
        localStorage.setItem('urls', JSON.stringify(state.urls));
      }
    },
    removeUrl: (state, action: PayloadAction<string>) => {
      state.urls = state.urls.filter((url) => url.shortUrl !== action.payload);
    }
  },
});

export const { addUrl, updateVisits, removeUrl } = urlsSlice.actions;
export default urlsSlice.reducer;
