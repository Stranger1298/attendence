import React, { useState } from 'react';
import { Box, Button, Typography, TextField, List, ListItem, ListItemText, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';

const Todo = () => {
  const [todoItems, setTodoItems] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddTodo = async (e) => {
    e.preventDefault();
    const trimmedTodo = newTodo.trim();
    if (!trimmedTodo) return;

    try {
      setIsSubmitting(true);
      const newTodoItem = { 
        text: trimmedTodo, 
        completed: false 
      };
      setTodoItems([...todoItems, newTodoItem]);
      setNewTodo('');
    } catch (error) {
      console.error('Failed to add todo:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTodo = (index) => {
    const updatedTodos = todoItems.filter((_, i) => i !== index);
    setTodoItems(updatedTodos);
  };

  const handleToggleComplete = (index) => {
    const updatedTodos = todoItems.map((item, i) => 
      i === index ? { ...item, completed: !item.completed } : item
    );
    setTodoItems(updatedTodos);
  };

  const handleClearCompleted = () => {
    const updatedTodos = todoItems.filter(item => !item.completed);
    setTodoItems(updatedTodos);
  };

  return (
    <Box sx={{ mt: 4, maxWidth: 400, mx: 'auto', p: 3, border: '1px solid #e0e0e0', borderRadius: '12px', boxShadow: 2, backgroundColor: '#f9f9f9' }}>
      <Typography variant="h5" color="primary" sx={{ mb: 2, textAlign: 'center', fontWeight: 'bold' }}>
        To-Do List
      </Typography>
      <form onSubmit={handleAddTodo} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <TextField
          variant="outlined"
          placeholder="Add a new task..."
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          disabled={isSubmitting}
          fullWidth
          sx={{ borderRadius: '8px' }}
        />
        <Button 
          type="submit" 
          variant="contained" 
          color="primary"
          disabled={isSubmitting || !newTodo.trim()}
          sx={{ borderRadius: '8px' }}
        >
          {isSubmitting ? 'Adding...' : 'Add'}
        </Button>
      </form>

      <List>
        {todoItems.map((item, index) => (
          <ListItem key={index} sx={{ justifyContent: 'space-between', bgcolor: item.completed ? '#e0f7fa' : '#ffffff', borderRadius: '8px', mb: 1, boxShadow: 1 }}>
            <ListItemText primary={item.text} sx={{ textDecoration: item.completed ? 'line-through' : 'none' }} />
            <Box>
              <IconButton onClick={() => handleToggleComplete(index)} color="success">
                <CheckIcon />
              </IconButton>
              <IconButton onClick={() => handleDeleteTodo(index)} color="error">
                <DeleteIcon />
              </IconButton>
            </Box>
          </ListItem>
        ))}
      </List>
      <Button variant="outlined" onClick={handleClearCompleted} sx={{ mt: 2, borderRadius: '8px' }}>
        Clear Completed
      </Button>
    </Box>
  );
};

export default Todo;
