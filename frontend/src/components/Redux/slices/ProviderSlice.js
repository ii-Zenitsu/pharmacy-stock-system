import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  providers: [],
  loading: false,
  error: null,
};

const providersSlice = createSlice({
  name: 'providers',
  initialState,
  reducers: {
    setProviders(state, action) {
      state.providers = action.payload;
    },
    addProvider(state, action) {
      state.providers.push(action.payload);
    },
    updateProvider(state, action) {
      const index = state.providers.findIndex(provider => provider.id === action.payload.id);
      if (index !== -1) {
        state.providers[index] = action.payload;
      }
    },
    deleteProvider(state, action) {
      state.providers = state.providers.filter(provider => provider.id !== action.payload);
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    }
  },
});

export const { setProviders, addProvider, updateProvider, deleteProvider, setLoading, setError } = providersSlice.actions;
const ProvidersReducer = providersSlice.reducer;

export default ProvidersReducer;
