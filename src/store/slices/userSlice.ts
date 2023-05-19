import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { isEmpty } from 'lodash';

import { USER } from '@/constants/storeLocation';
import { fetchMe } from '@/services/user.service';
import type { AppState, AppThunk } from '@/store/store';
import { get as storeGet, put as storePut } from '@/utils/storageHelper';

export interface UserState {
	user: IUser | null;
	status: TStateAsyncStatus;
}

const initialState: UserState = {
	user: null,
	status: 'idle'
};

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(fetchMeAsync())`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
export const fetchMeAsync = createAsyncThunk('user/fetchMe', async () => {
	const response = await fetchMe();
	// The value we return becomes the `fulfilled` action payload
	return response.data.user;
});

export const userSlice = createSlice({
	name: 'user',
	initialState,
	// The `reducers` field lets us define reducers and generate associated actions
	reducers: {
		// Use the PayloadAction type to declare the contents of `action.payload`
		// Initial my user state from action payload
		initUser: (state, action: PayloadAction<IUser>) => {
			state.user = action.payload;
		}
	},
	// The `extraReducers` field lets the slice handle actions defined elsewhere,
	// including actions generated by createAsyncThunk or in other slices.
	extraReducers: builder => {
		builder
			.addCase(fetchMeAsync.pending, state => {
				state.status = 'loading';
			})
			.addCase(fetchMeAsync.fulfilled, (state, action) => {
				state.status = 'idle';
				state.user = action.payload;
				storePut(USER, action.payload);
			});
	}
});

export const { initUser } = userSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
export const selectUser = (state: AppState) => state.user.user;

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.

// Initial my user state from local storage or fetch from server
export const initMe = (): AppThunk => async (dispatch, getState) => {
	const { user } = getState().user;
	if (!user) {
		const userLocalStorage: IUser | null = storeGet(USER);
		if (!isEmpty(userLocalStorage)) {
			dispatch(userSlice.actions.initUser(userLocalStorage));
		} else {
			dispatch(fetchMeAsync());
		}
	}
};

export default userSlice.reducer;
