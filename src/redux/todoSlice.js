// todoSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from './api';

export const fetchTodos = createAsyncThunk(
    'todos/fetchTodos',
    async () => {
        const response = await api.getAllTodos();
        return response;
    }
);

export const createTodo = createAsyncThunk(
    'todos/createTodo',
    async (todoData) => {
        const response = await api.createTodo(todoData);
        return response;
    }
);

export const updateTodo = createAsyncThunk(
    'todos/updateTodo',
    async ({ id, todoData }) => {
        const response = await api.updateTodo(id, todoData);
        return response;
    }
);

export const deleteTodo = createAsyncThunk(
    'todos/deleteTodo',
    async (id) => {
        await api.deleteTodo(id);
        return id;
    }
);

const todoSlice = createSlice({
    name: 'todos',
    initialState: {
        items: [],
        status: 'idle',
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTodos.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchTodos.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchTodos.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(createTodo.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })
            .addCase(updateTodo.fulfilled, (state, action) => {
                const index = state.items.findIndex(todo => todo.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            .addCase(deleteTodo.fulfilled, (state, action) => {
                state.items = state.items.filter(todo => todo.id !== action.payload);
            });
    }
});

export default todoSlice.reducer;
