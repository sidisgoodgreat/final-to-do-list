import React, { useState, useEffect } from 'react';
import { 
    Drawer,
    IconButton,
    Avatar,
    Dialog,
    DialogContent,
    TextField,
    Button,
    Select,
    MenuItem,
    Box,
    Typography
} from '@mui/material';
import { 
    CalendarToday as CalendarTodayIcon,
    Notifications as NotificationsIcon,
    Sync as SyncIcon
} from '@mui/icons-material';
import DatePicker from 'react-datepicker';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "react-datepicker/dist/react-datepicker.css";
import './Sidebar.css';

const Sidebar = ({ 
    sidebarOpen, 
    currentUser, 
    currentPage, 
    onTodoCreated, 
    editingTodo,
    onEditComplete 
}) => {
    const navigate = useNavigate();
    const [dialogOpen, setDialogOpen] = useState(false);
    const currentDateTime = new Date();
    const [selectedDate, setSelectedDate] = useState(currentDateTime);
    const [selectedTime, setSelectedTime] = useState(
        currentDateTime.getHours().toString().padStart(2, '0') + ':' + 
        (currentDateTime.getMinutes() >= 30 ? '30' : '00')
    );
    const [error, setError] = useState('');
    const [todo, setTodo] = useState({
        title: '',
        description: '',
        dueDateTimestamp: currentDateTime,
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
        if (editingTodo) {
            setTodo(editingTodo);
            setSelectedDate(new Date(editingTodo.dueDateTimestamp));
            const date = new Date(editingTodo.dueDateTimestamp);
            setSelectedTime(
                date.getHours().toString().padStart(2, '0') + ':' + 
                date.getMinutes().toString().padStart(2, '0')
            );
            setDialogOpen(true);
        }
    }, [editingTodo]);

    const handleCreateOrUpdateTodo = async () => {
        try {
            if (!todo.title.trim()) {
                setError('Please enter a title for the todo');
                return;
            }

            const combinedDateTime = new Date(selectedDate);
            const [hours, minutes] = selectedTime.split(':');
            combinedDateTime.setHours(parseInt(hours), parseInt(minutes));

            if (combinedDateTime < currentDateTime && !todo.id) {
                setError('Cannot set todo time in the past');
                return;
            }

            const todoData = {
                ...todo,
                dueDateTimestamp: combinedDateTime.getTime()
            };

            let response;
            if (todo.id) {
                // Update existing todo
                response = await axios.put(
                    `https://677a9e66671ca030683469a3.mockapi.io/todo/createTodo/${todo.id}`,
                    todoData
                );
            } else {
                // Check for duplicates only when creating new todo
                const existingResponse = await axios.get('https://677a9e66671ca030683469a3.mockapi.io/todo/createTodo');
                const isDuplicate = existingResponse.data.some(existingTodo => 
                    existingTodo.title.trim().toLowerCase() === todo.title.trim().toLowerCase()
                );

                if (isDuplicate) {
                    setError('A todo with this title already exists');
                    return;
                }

                // Create new todo
                response = await axios.post(
                    'https://677a9e66671ca030683469a3.mockapi.io/todo/createTodo',
                    todoData
                );
            }

            if (response.status === 200 || response.status === 201) {
                handleDialogClose();
                if (onTodoCreated) {
                    onTodoCreated();
                }
            }
        } catch (error) {
            console.error('Error creating/updating todo:', error);
            setError('Failed to save todo. Please try again.');
        }
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        resetForm();
        if (onEditComplete) {
            onEditComplete();
        }
    };

    const resetForm = () => {
        const resetDateTime = new Date();
        setTodo({
            title: '',
            description: '',
            dueDateTimestamp: resetDateTime,
            reminder: 'none',
            repeat: 'never',
            status: 'new',
            active: 1,
            assignee: null
        });
        setSelectedDate(resetDateTime);
        setSelectedTime(
            resetDateTime.getHours().toString().padStart(2, '0') + ':' + 
            (resetDateTime.getMinutes() >= 30 ? '30' : '00')
        );
        setError('');
    };

    const getTimeOptions = () => {
        const options = [];
        ['AM', 'PM'].forEach(period => {
            for (let hour = 0; hour < 12; hour++) {
                const displayHour = hour === 0 ? 12 : hour;
                const militaryHour = period === 'AM' ? 
                    (hour === 12 ? 0 : hour) : 
                    (hour === 12 ? 12 : hour + 12);
                ['00', '30'].forEach(minutes => {
                    options.push({
                        label: `${displayHour}:${minutes} ${period}`,
                        value: `${militaryHour.toString().padStart(2, '0')}:${minutes}`
                    });
                });
            }
        });
        return options;
    };

    return (
        <>
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
                <button className="add-button" onClick={() => {
                    resetForm();
                    setDialogOpen(true);
                }}>+</button>
                <div 
                    className="calendar-icon" 
                    onClick={() => navigate('/today')}
                    style={{ cursor: 'pointer' }}
                >
                    {currentDateTime.getDate()}
                </div>
                <IconButton 
                    onClick={() => currentPage === 'today' && navigate('/upcoming')}
                    className="nav-button"
                >
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

            <Dialog 
                open={dialogOpen} 
                onClose={handleDialogClose}
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
                        value={todo.title}
                        onChange={(e) => setTodo({...todo, title: e.target.value})}
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
                        value={todo.description}
                        onChange={(e) => setTodo({...todo, description: e.target.value})}
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
                            minDate={new Date()}
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
                            {getTimeOptions().map(option => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </Box>
                    {error && (
                        <Typography color="error" sx={{ mb: 2 }}>
                            {error}
                        </Typography>
                    )}
                    <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>Reminder</Typography>
                    <Select
                        fullWidth
                        value={todo.reminder}
                        onChange={(e) => setTodo({...todo, reminder: e.target.value})}
                        variant="outlined"
                        sx={{ mb: 3 }}
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
                        value={todo.repeat}
                        onChange={(e) => setTodo({...todo, repeat: e.target.value})}
                        variant="outlined"
                        sx={{ mb: 3 }}
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
                        onClick={handleCreateOrUpdateTodo}
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
                        {todo.id ? 'Update Todo' : 'Create Todo'}
                    </Button>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default Sidebar;

