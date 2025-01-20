// src/redux/api.js
import axios from 'axios';

const BASE_URL = 'https://677a9e66671ca030683469a3.mockapi.io/todo/createTodo';

export const api = {
    getAllTodos: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/createTodo`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    createTodo: async (todoData) => {
        try {
            const response = await axios.post(`${BASE_URL}/createTodo`, todoData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    updateTodo: async (id, todoData) => {
        try {
            const response = await axios.put(`${BASE_URL}/createTodo/${id}`, todoData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    deleteTodo: async (id) => {
        try {
            const response = await axios.delete(`${BASE_URL}/createTodo/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};
