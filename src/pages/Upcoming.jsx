import React, { useState, useEffect } from 'react';
import { 
    Box,
    IconButton,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Avatar
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SyncIcon from '@mui/icons-material/Sync';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import './Upcoming.css';

const Upcoming = () => {
    const [todos, setTodos] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const [expandedTodoId, setExpandedTodoId] = useState(null);

    useEffect(() => {
        fetchTodos();
        const userData = localStorage.getItem('currentUser');
        if (userData) {
            setCurrentUser(JSON.parse(userData));
        }
    }, []);

    const fetchTodos = async () => {
        try {
            const response = await axios.get('https://677a9e66671ca030683469a3.mockapi.io/todo/createTodo');
            const currentDateTime = new Date();
            const validTodos = response.data.filter(todo => todo.title && todo.title.trim());
            const futureTodos = validTodos.filter(todo => new Date(todo.dueDateTimestamp) > currentDateTime);
            const sortedTodos = futureTodos.sort((a, b) => a.dueDateTimestamp - b.dueDateTimestamp);
            setTodos(sortedTodos);
        } catch (error) {
            console.error('Error fetching todos:', error);
        }
    };

    const handleDeleteTodo = async (id) => {
        try {
            await axios.delete(`https://677a9e66671ca030683469a3.mockapi.io/todo/createTodo/${id}`);
            fetchTodos();
        } catch (error) {
            console.error('Error deleting todo:', error);
        }
    };

    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const groupTodosByDate = (todos) => {
        const groups = {};
        todos.forEach(todo => {
            const date = new Date(todo.dueDateTimestamp);
            const dateKey = `${date.getDate().toString().padStart(2, '0')} ${date.toLocaleString('default', { month: 'short' })} • ${date.toLocaleString('default', { weekday: 'short' })}`;
            if (!groups[dateKey]) {
                groups[dateKey] = [];
            }
            groups[dateKey].push(todo);
        });
        return groups;
    };

    const groupedTodos = groupTodosByDate(todos);

    return (
        <Box sx={{ display: 'flex' }}>
            <IconButton 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                sx={{ 
                    position: 'fixed',
                    left: sidebarOpen ? '80px' : '10px',
                    top: '10px',
                    zIndex: 1200,
                    transition: 'left 0.3s'
                }}
            >
                <MenuIcon />
            </IconButton>

            <Sidebar 
                sidebarOpen={sidebarOpen}
                currentUser={currentUser}
                currentPage="upcoming"
                onTodoCreated={fetchTodos}
            />

            <Box 
                component="main" 
                sx={{ 
                    flexGrow: 1, 
                    p: 3,
                    marginLeft: sidebarOpen ? '80px' : 0,
                    transition: 'margin 0.3s'
                }}
            >
                <Typography variant="h4" sx={{ mb: 2, mt: 5 }}>Upcoming</Typography>
                <div className="todo-count">
                    <CalendarTodayIcon />
                    <Typography>{todos.length} To-Dos</Typography>
                </div>

                <div className="todos-section">
                    {Object.entries(groupedTodos).map(([date, dateTodos]) => (
                        <Accordion key={date} defaultExpanded>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="h6">{date}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                {dateTodos.map(todo => (
                                    <div key={todo.id} className="todo-item">
                                        <div className="todo-left">
                                            <input 
                                                type="checkbox" 
                                                className="todo-checkbox"
                                                onChange={() => handleDeleteTodo(todo.id)}
                                            />
                                            <div className="todo-content">
                                                <Typography 
                                                    className="todo-title"
                                                    onClick={() => setExpandedTodoId(expandedTodoId === todo.id ? null : todo.id)}
                                                    sx={{ cursor: 'pointer' }}
                                                >
                                                    {todo.title}
                                                </Typography>
                                                {expandedTodoId === todo.id && todo.description && (
                                                    <Typography className="todo-description">
                                                        {todo.description}
                                                    </Typography>
                                                )}
                                                <div className="todo-info">
                                                    <CalendarTodayIcon className="todo-icon" />
                                                    <span className="todo-time">
                                                        {formatTime(todo.dueDateTimestamp)}
                                                    </span>
                                                    {todo.reminder !== 'none' && (
                                                        <NotificationsIcon className="reminder-icon" />
                                                    )}
                                                    {todo.repeat !== 'never' && (
                                                        <SyncIcon className="repeat-icon" />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </div>
            </Box>
        </Box>
    );
};

export default Upcoming;

