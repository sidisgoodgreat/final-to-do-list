import React, { useState, useEffect } from 'react';
import { 
    Box, 
    IconButton, 
    Typography, 
    Accordion, 
    AccordionSummary, 
    AccordionDetails,
} from '@mui/material';
import { 
    Menu as MenuIcon, 
    ExpandMore as ExpandMoreIcon, 
    CalendarToday as CalendarTodayIcon,
    Notifications as NotificationsIcon,
    Sync as SyncIcon,
    Edit as EditIcon
} from '@mui/icons-material';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import './Upcoming.css';

const Upcoming = () => {
    const [todos, setTodos] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingTodo, setEditingTodo] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState(
        new Date().getHours().toString().padStart(2, '0') + ':' + 
        (new Date().getMinutes() >= 30 ? '30' : '00')
    );
    const [newTodo, setNewTodo] = useState({
        title: '',
        description: '',
        dueDateTimestamp: new Date(),
        reminder: 'none',
        repeat: 'never',
        status: 'new',
        active: 1,
        assignee: null
    });

    useEffect(() => {
        fetchTodos();
        const userData = localStorage.getItem('currentUser');
        if (userData) setCurrentUser(JSON.parse(userData));
    }, []);

    const fetchTodos = async () => {
        try {
            const response = await axios.get('https://677a9e66671ca030683469a3.mockapi.io/todo/createTodo');
            const currentDateTime = new Date();
            const todayStart = new Date(currentDateTime).setHours(0, 0, 0, 0);

            const validTodos = response.data.filter(todo => {
                const todoDateTime = new Date(todo.dueDateTimestamp);
                const todoDate = new Date(todoDateTime).setHours(0, 0, 0, 0);
                return todoDate > todayStart;
            });

            setTodos(validTodos.sort((a, b) => a.dueDateTimestamp - b.dueDateTimestamp));
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

    const handleEditTodo = (todo) => {
        setDialogOpen(true);
        setEditingTodo(todo);
        setNewTodo(todo);
        setSelectedDate(new Date(todo.dueDateTimestamp));
        const date = new Date(todo.dueDateTimestamp);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        setSelectedTime(`${hours}:${minutes}`);
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        const minutesStr = minutes.toString().padStart(2, '0');
        return `${hours}:${minutesStr} ${ampm}`;
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
                editingTodo={editingTodo}
                onEditComplete={() => {
                    setEditingTodo(null);
                    setDialogOpen(false);
                }}
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
                                        <IconButton 
                                            onClick={() => handleEditTodo(todo)}
                                            sx={{ color: '#666' }}
                                        >
                                            <EditIcon />
                                        </IconButton>
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

