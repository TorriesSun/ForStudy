import { Action, ThunkAction, configureStore } from '@reduxjs/toolkit';

import conversationReducer from './slices/conversationSlice';
import userReducer from './slices/userSlice';

export function makeStore() {
	return configureStore({
		reducer: { user: userReducer, conversation: conversationReducer }
	});
}

const store = makeStore();

export type AppState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
	ReturnType,
	AppState,
	unknown,
	Action<string>
>;

export default store;
