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
import './TodayPage.css';

const TodayPage = () => {
    const [todos, setTodos] = useState({ overdue: [], today: [] });
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);

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
            
            const todayStart = new Date(currentDateTime);
            todayStart.setHours(0, 0, 0, 0);
            
            const todayEnd = new Date(currentDateTime);
            todayEnd.setHours(23, 59, 59, 999);

            const overdueTodos = validTodos.filter(todo => {
                const todoDateTime = new Date(todo.dueDateTimestamp);
                return todoDateTime < todayStart;
            });

            const todayTodos = validTodos.filter(todo => {
                const todoDateTime = new Date(todo.dueDateTimestamp);
                return todoDateTime >= todayStart && todoDateTime <= todayEnd;
            });

            setTodos({
                overdue: overdueTodos.sort((a, b) => b.dueDateTimestamp - a.dueDateTimestamp),
                today: todayTodos.sort((a, b) => a.dueDateTimestamp - b.dueDateTimestamp)
            });
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
                currentPage="today"
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
                <Typography variant="h4" sx={{ mb: 2, mt: 5 }}>Today</Typography>
                <div className="todo-count">
                    <CalendarTodayIcon />
                    <Typography>
                        {todos.overdue.length + todos.today.length} To-Dos
                    </Typography>
                </div>

                <div className="todos-section">
                    {todos.overdue.length > 0 && (
                        <Accordion defaultExpanded>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="h6" className="overdue-title">
                                    Overdue
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                {todos.overdue.map(todo => (
                                    <div key={todo.id} className="todo-item">
                                        <div className="todo-left">
                                            <input 
                                                type="checkbox" 
                                                className="todo-checkbox"
                                                onChange={() => handleDeleteTodo(todo.id)}
                                            />
                                            <div className="todo-content">
                                                <Typography className="todo-title">
                                                    {todo.title}
                                                </Typography>
                                                {todo.description && (
                                                    <Typography className="todo-description">
                                                        {todo.description}
                                                    </Typography>
                                                )}
                                                <div className="todo-info">
                                                    <CalendarTodayIcon className="todo-icon" />
                                                    <span className="todo-date overdue">
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
                    )}

                    <Accordion defaultExpanded>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography variant="h6">Today's Tasks</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            {todos.today.map(todo => (
                                <div key={todo.id} className="todo-item">
                                    <div className="todo-left">
                                        <input 
                                            type="checkbox" 
                                            className="todo-checkbox"
                                            onChange={() => handleDeleteTodo(todo.id)}
                                        />
                                        <div className="todo-content">
                                            <Typography className="todo-title">
                                                {todo.title}
                                            </Typography>
                                            {todo.description && (
                                                <Typography className="todo-description">
                                                    {todo.description}
                                                </Typography>
                                            )}
                                            <div className="todo-info">
                                                <CalendarTodayIcon className="todo-icon" />
                                                <span className="todo-date">
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
                </div>
            </Box>
        </Box>
    );
};

export default TodayPage;
