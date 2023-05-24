import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import {
	createConversationByUser,
	deleteConversationById,
	fetchMyConversationById,
	fetchMyConversations,
	updateConversationById
} from '@/services/conversation.service';
import type { AppState, AppThunk } from '@/store/store';

export interface ConversationState {
	conversations: IConversation[];
	currentConversation: IConversation | undefined;
	conversationsStatus: TStateAsyncStatus;
	currentConversationStatus: TStateAsyncStatus;
}

const initialState: ConversationState = {
	conversations: [],
	currentConversation: undefined,
	conversationsStatus: 'idle',
	currentConversationStatus: 'idle'
};

export const fetchMyConversationsAsync = createAsyncThunk(
	'conversation/fetchMyConversations',
	async () => {
		const response = await fetchMyConversations();
		return response.data.docs;
	}
);

export const fetchMyConversationByIdAsync = createAsyncThunk(
	'conversation/fetchMyConversationById',
	async (id: string) => {
		const response = await fetchMyConversationById(id);
		return response.data;
	}
);

export const ConversationSlice = createSlice({
	name: 'conversation',
	initialState,
	reducers: {
		// Use the PayloadAction type to declare the contents of `action.payload`
		updateConversations: (state, action: PayloadAction<IConversation[]>) => {
			state.conversations = action.payload;
		},
		updateCurrentConversation: (state, action: PayloadAction<Partial<IConversation>>) => {
			if (state.currentConversation) {
				state.currentConversation = {
					...state.currentConversation,
					...action.payload
				};
			}
		},
		unselectCurrentConversation: state => {
			state.currentConversation = undefined;
		}
	},
	// The `extraReducers` field lets the slice handle actions defined elsewhere,
	// including actions generated by createAsyncThunk or in other slices.
	extraReducers: builder => {
		builder
			// conversations
			.addCase(fetchMyConversationsAsync.pending, state => {
				state.conversationsStatus = 'loading';
			})
			.addCase(fetchMyConversationsAsync.fulfilled, (state, action) => {
				state.conversationsStatus = 'idle';
				state.conversations = action.payload;
			})
			// current conversation
			.addCase(fetchMyConversationByIdAsync.pending, state => {
				state.currentConversationStatus = 'loading';
			})
			.addCase(fetchMyConversationByIdAsync.fulfilled, (state, action) => {
				state.currentConversationStatus = 'idle';
				state.currentConversation = action.payload;
			});
	}
});

export const { updateConversations, updateCurrentConversation, unselectCurrentConversation } =
	ConversationSlice.actions;

export const selectConversationState = (state: AppState) => state.conversation;

// write thunks by hand

export const fetchConversations = (): AppThunk => async dispatch => {
	const conversationsResponse = await fetchMyConversations();
	dispatch(updateConversations(conversationsResponse.data.docs));
};

export const createConversation =
	(payload: TCreateConversationPayload): AppThunk =>
	async dispatch => {
		const conversationResponse = await createConversationByUser(payload);
		if (conversationResponse.status === 201) {
			dispatch(fetchConversations());
		}
	};

// This is used for updating a conversation, except for the chat history
export const updateConversation =
	(payload: TUpdateConversationPayload): AppThunk =>
	async (dispatch, getState) => {
		const conversationResponse = await updateConversationById(payload);
		if (conversationResponse.status === 200) {
			const { currentConversation, conversations } = getState().conversation;
			if (currentConversation?.id === payload.id) {
				dispatch(updateCurrentConversation(payload));
			}
			if (
				conversations?.some((conversation: IConversation) => conversation.id === payload.id)
			) {
				dispatch(fetchConversations());
			}
		}
	};

export const deleteConversation =
	(id: string): AppThunk =>
	async (dispatch, getState) => {
		const deleteResponse = await deleteConversationById(id);
		if (deleteResponse.status === 200) {
			const { currentConversation, conversations } = getState().conversation;
			if (currentConversation?.id === id) {
				dispatch(unselectCurrentConversation());
			}
			if (conversations?.some((conversation: IConversation) => conversation.id === id)) {
				dispatch(fetchConversations());
			}
		}
	};

export default ConversationSlice.reducer;