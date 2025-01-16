import React, { useState, useEffect } from 'react';
import { 
    Box,
    Drawer,
    IconButton,
    Avatar,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Dialog,
    DialogContent,
    TextField,
    Button,
    Select,
    MenuItem
} from '@mui/material';
import DatePicker from 'react-datepicker';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SyncIcon from '@mui/icons-material/Sync';
import { useNavigate } from 'react-router-dom';
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import './Upcoming.css';

const Upcoming = () => {
    const navigate = useNavigate();
    const [todos, setTodos] = useState([]);
    const [open, setOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date(2025, 0, 16, 5, 0, 0));
    const [selectedTime, setSelectedTime] = useState('10:00');
    const [newTodo, setNewTodo] = useState({
        title: '',
        description: '',
        dueDateTimestamp: new Date(2025, 0, 16, 5, 0, 0),
        reminder: 'none',
        repeat: 'never',
        status: 'new',
        active: 1,
        assignee: null
    });

    const reminderOptions = [
        { value: 'none', label: 'None' },
        { value: '5min', label: '5 minutes before' },
        { value: '10min', label: '10 minutes before' },
        { value: '1hour', label: '1 hour before' },
        { value: '1day', label: '1 day before' },
        { value: '1week', label: '1 week before' }
    ];

    const repeatOptions = [
        { value: 'never', label: 'Never' },
        { value: 'daily', label: 'Daily' },
        { value: 'weekly', label: 'Weekly' },
        { value: 'monthly', label: 'Monthly' }
    ];

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
            const currentDateTime = new Date(2025, 0, 16, 5, 0, 0);
            const futureTodos = response.data.filter(todo => new Date(todo.dueDateTimestamp) > currentDateTime);
            const sortedTodos = futureTodos.sort((a, b) => a.dueDateTimestamp - b.dueDateTimestamp);
            setTodos(sortedTodos);
        } catch (error) {
            console.error('Error fetching todos:', error);
        }
    };

    const handleCreateTodo = async () => {
        try {
            const combinedDateTime = new Date(selectedDate);
            const [hours, minutes] = selectedTime.split(':');
            combinedDateTime.setHours(parseInt(hours), parseInt(minutes));

            await axios.post('https://677a9e66671ca030683469a3.mockapi.io/todo/createTodo', {
                ...newTodo,
                dueDateTimestamp: combinedDateTime.getTime()
            });
            setOpen(false);
            fetchTodos();
            resetForm();
        } catch (error) {
            console.error('Error creating todo:', error);
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

    const resetForm = () => {
        setNewTodo({
            title: '',
            description: '',
            dueDateTimestamp: new Date(2025, 0, 16, 5, 0, 0),
            reminder: 'none',
            repeat: 'never',
            status: 'new',
            active: 1,
            assignee: null
        });
        setSelectedDate(new Date(2025, 0, 16, 5, 0, 0));
        setSelectedTime('10:00');
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

    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
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

            <Drawer
                variant="persistent"
                anchor="left"
                open={sidebarOpen}
                sx={{
                    width: 80,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: 80,
                        boxSizing: 'border-box',
                        backgroundColor: 'white',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        padding: '20px 0',
                        gap: '20px'
                    },
                }}
            >
                <button className="add-button" onClick={() => setOpen(true)}>+</button>
                <div className="calendar-icon">{new Date(2025, 0, 16).getDate()}</div>
                <IconButton onClick={() => navigate('/today')}>
                    <CalendarTodayIcon />
                </IconButton>
                {currentUser?.avatar && (
                    <Avatar 
                        src={currentUser.avatar} 
                        sx={{
                            position: 'absolute',
                            bottom: 20,
                            width: 50,
                            height: 50
                        }}
                    />
                )}
            </Drawer>

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
                                        {todo.assignee && (
                                            <div className="assignee-info">
                                                <Typography className="assignee-name">
                                                    {todo.assignee}
                                                </Typography>
                                                <Avatar 
                                                    src={todo.assigneeAvatar} 
                                                    className="assignee-avatar"
                                                />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </div>
            </Box>

            <Dialog 
                open={open} 
                onClose={() => {
                    setOpen(false);
                    resetForm();
                }}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: '12px',
                        padding: '24px'
                    }
                }}
            >
                <DialogContent sx={{ p: 0 }}>
                    <TextField
                        fullWidth
                        placeholder="What would you like to do?"
                        value={newTodo.title}
                        onChange={(e) => setNewTodo({...newTodo, title: e.target.value})}
                        variant="standard"
                        InputProps={{
                            disableUnderline: true,
                            sx: {
                                fontSize: '1.2rem',
                                '&::placeholder': {
                                    color: '#999',
                                    opacity: 1
                                }
                            }
                        }}
                        sx={{ mb: 3 }}
                    />
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        placeholder="Add Description"
                        value={newTodo.description}
                        onChange={(e) => setNewTodo({...newTodo, description: e.target.value})}
                        variant="standard"
                        InputProps={{
                            disableUnderline: true,
                            sx: {
                                '&::placeholder': {
                                    color: '#999',
                                    opacity: 1
                                }
                            }
                        }}
                        sx={{ mb: 3 }}
                    />
                    <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                        <DatePicker
                            selected={selectedDate}
                            onChange={setSelectedDate}
                            dateFormat="MMMM d, yyyy"
                            customInput={
                                <TextField
                                    variant="outlined"
                                    sx={{
                                        flex: 2,
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '8px'
                                        }
                                    }}
                                />
                            }
                        />
                        <Select
                            value={selectedTime}
                            onChange={(e) => setSelectedTime(e.target.value)}
                            variant="outlined"
                            sx={{ 
                                flex: 1,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '8px'
                                }
                            }}
                        >
                            {Array.from({ length: 24 }, (_, hour) => (
                                [0, 30].map(minute => {
                                    const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                                    return (
                                        <MenuItem key={timeString} value={timeString}>
                                            {timeString}
                                        </MenuItem>
                                    );
                                })
                            )).flat()}
                        </Select>
                    </Box>
                    <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>Reminder</Typography>
                    <Select
                        fullWidth
                        value={newTodo.reminder}
                        onChange={(e) => setNewTodo({...newTodo, reminder: e.target.value})}
                        variant="outlined"
                        sx={{ 
                            mb: 3,
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '8px'
                            }
                        }}
                    >
                        {reminderOptions.map(option => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </Select>
                    <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>Repeat</Typography>
                    <Select
                        fullWidth
                        value={newTodo.repeat}
                        onChange={(e) => setNewTodo({...newTodo, repeat: e.target.value})}
                        variant="outlined"
                        sx={{ 
                            mb: 3,
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '8px'
                            }
                        }}
                    >
                        {repeatOptions.map(option => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </Select>
                    <Button 
                        fullWidth 
                        variant="contained"
                        onClick={handleCreateTodo}
                        sx={{
                            py: 1.5,
                            backgroundColor: '#2196f3',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            fontWeight: 600,
                            '&:hover': {
                                backgroundColor: '#1976d2'
                            }
                        }}
                    >
                        CREATE TODO
                    </Button>
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default Upcoming;


