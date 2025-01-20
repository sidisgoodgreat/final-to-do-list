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
    const [selectedDate, setSelectedDate] = useState(new Date(2025, 0, 19, 21, 0, 0));
    const [selectedTime, setSelectedTime] = useState('21:00');
    const [error, setError] = useState('');
    const [newTodo, setNewTodo] = useState({
        title: '',
        description: '',
        dueDateTimestamp: new Date(2025, 0, 19, 21, 0, 0),
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

            if (combinedDateTime < new Date(2025, 0, 19, 21, 0, 0)) {
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
        setNewTodo({
            title: '',
            description: '',
            dueDateTimestamp: new Date(2025, 0, 19, 21, 0, 0),
            reminder: 'none',
            repeat: 'never',
            status: 'new',
            active: 1,
            assignee: null
        });
        setSelectedDate(new Date(2025, 0, 19, 21, 0, 0));
        setSelectedTime('21:00');
        setError('');
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
                <div className="calendar-icon">{new Date(2025, 0, 19).getDate()}</div>
                <IconButton 
                    onClick={() => navigate(currentPage === 'today' ? '/upcoming' : '/today')}
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
                            minDate={new Date(2025, 0, 19, 21, 0, 0)}
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
