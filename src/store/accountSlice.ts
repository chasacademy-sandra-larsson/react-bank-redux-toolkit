import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit' // För att typa action.payload i reducer-funktioner

// Typescript interface för state
export interface AccountState {
  balance: number
  loan: number
  loanPurpose: string
  isActive: boolean
  isLoading: boolean
}

// Initial state
const initialState: AccountState = {
  balance: 0,
  loan: 0,
  loanPurpose: '',
  isActive: false,
  isLoading: false,
}

// Accountslice med reducer-funktioner
export const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {

    openAccount: (state) => {
      if (state.isActive) return;
      state.balance = 0
      state.loan = 0
      state.isActive = true
    },
    // Denna behövs inte längre då vi använder createAsyncThunk (och hämtar från API för currency conversion)
    // deposit: (state, action) => {
    //   state.balance += action.payload
    //   state.isLoading = false;
    // },
    // För deposit se i extraReducers
    withdraw: (state, action: PayloadAction<number>) => {
      state.balance -= action.payload
    },
    requestLoan: (state, action: PayloadAction<{ amount: number; purpose: string }>) => {
      if (state.loan > 0) return;

      state.loan = action.payload.amount;
      state.loanPurpose = action.payload.purpose;
      state.balance += action.payload.amount;

    },
    payLoan: (state, action: PayloadAction<number>) => {
      state.loan -= action.payload;
      state.loan = 0
      state.loanPurpose = ''
    },
    closeAccount: (state) => {
      if (state.loan > 0 || state.balance !== 0) return state;
      return initialState;
    },
    // convertingCurrency(state) {
    //   state.isLoading = true;
    // },
  },

  //  extraReducers är en reducer som kan hantera actions från andra slices eller från createAsyncThunk
  // builder är en objekt som innehåller metoder för att lägga till case reducers
  // med addCase kan vi fånga upp olika action från den asynkrona hämtningen (pending, fulfilled, rejected)
  // https://redux-toolkit.js.org/api/createAsyncThunk
  extraReducers: (builder) => {
    builder.addCase(deposit.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(deposit.fulfilled, (state, action: PayloadAction<number>) => {
      state.balance += action.payload;
      state.isLoading = false;
    });
    builder.addCase(deposit.rejected, (state) => {
      state.isLoading = false;
    });
  },
})

// createAsyncThunk tar två argument, ett namn och en funktion som returnerar en promise
export const deposit = createAsyncThunk(
  'account/deposit',
  async ({ amount, currency }: { amount: number; currency: string }) => {
    if (currency === "USD") {
      return amount;
    } else {
      const response = await fetch(
        `https://api.frankfurter.app/latest?amount=${amount}&from=${currency}&to=USD`
      );
      const data = await response.json();
      return data.rates.USD;
    }
  }
);


// Exporterar alla actionfunktioner samt reducern
export const { openAccount, closeAccount, withdraw, requestLoan, payLoan } = accountSlice.actions

export default accountSlice.reducer