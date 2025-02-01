import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
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
import DatePicker from 'react-datepicker';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SyncIcon from '@mui/icons-material/Sync';
import { useNavigate } from 'react-router-dom';
import { createTodo } from '../redux/todoSlice';
import axios from 'axios';
import "react-datepicker/dist/react-datepicker.css";
import './Sidebar.css';

const Sidebar = ({ sidebarOpen, currentUser, currentPage, onTodoCreated }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [dialogOpen, setDialogOpen] = useState(false);
    const currentDateTime = new Date();
    const [selectedDate, setSelectedDate] = useState(currentDateTime);
    const [selectedTime, setSelectedTime] = useState(
        currentDateTime.getHours().toString().padStart(2, '0') + ':' + 
        (currentDateTime.getMinutes() >= 30 ? '30' : '00')
    );
    const [error, setError] = useState('');
    const [newTodo, setNewTodo] = useState({
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

    const handleCreateTodo = async () => {
        try {
            if (!newTodo.title.trim()) {
                setError('Please enter a title for the todo');
                return;
            }

            const combinedDateTime = new Date(selectedDate);
            const [hours, minutes] = selectedTime.split(':');
            combinedDateTime.setHours(parseInt(hours), parseInt(minutes));

            if (combinedDateTime < currentDateTime) {
                setError('Cannot create todos in the past');
                return;
            }

            const response = await axios.post('https://677a9e66671ca030683469a3.mockapi.io/todo/createTodo', {
                ...newTodo,
                dueDateTimestamp: combinedDateTime.getTime()
            });

            if (response.status === 201 || response.status === 200) {
                setDialogOpen(false);
                resetForm();
                if (onTodoCreated) {
                    onTodoCreated();
                }
            }
        } catch (error) {
            console.error('Error creating todo:', error);
            setError('Failed to create todo. Please try again.');
        }
    };

    const resetForm = () => {
        const resetDateTime = new Date();
        setNewTodo({
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
        // AM times
        for (let hour = 0; hour < 12; hour++) {
            ['00', '30'].forEach(minute => {
                const h = hour === 0 ? '12' : hour.toString().padStart(2, '0');
                const timeString = `${h}:${minute} AM`;
                const value = `${hour.toString().padStart(2, '0')}:${minute}`;
                options.push({ label: timeString, value });
            });
        }
        // PM times
        for (let hour = 12; hour < 24; hour++) {
            ['00', '30'].forEach(minute => {
                const h = hour === 12 ? '12' : (hour - 12).toString().padStart(2, '0');
                const timeString = `${h}:${minute} PM`;
                const value = `${hour.toString().padStart(2, '0')}:${minute}`;
                options.push({ label: timeString, value });
            });
        }
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
                <button className="add-button" onClick={() => setDialogOpen(true)}>+</button>
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
                onClose={() => {
                    setDialogOpen(false);
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
                            minDate={currentDateTime}
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
        </>
    );
};

export default Sidebar;

