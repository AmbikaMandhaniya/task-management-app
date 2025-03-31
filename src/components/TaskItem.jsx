import React from 'react';
import { 
  Paper, 
  Typography, 
  IconButton, 
  Box,
  Chip
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  CheckCircle as CheckCircleIcon 
} from '@mui/icons-material';
import { Draggable } from 'react-beautiful-dnd';

const TaskItem = ({ task, onEdit, onDelete, onToggleComplete, index }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return '#f44336';
      case 'medium':
        return '#ff9800';
      case 'low':
        return '#4caf50';
      default:
        return '#757575';
    }
  };

  return (
    <Draggable draggableId={`task-${task.id}`} index={index}>
      {(provided) => (
        <Paper
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          elevation={3}
          sx={{
            p: 2,
            mb: 2,
            borderLeft: `4px solid ${getPriorityColor(task.priority)}`,
            backgroundColor: task.completed ? '#f5f5f5' : 'white',
            position: 'relative',
            textDecoration: task.completed ? 'line-through' : 'none',
            opacity: task.completed ? 0.7 : 1
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h6" component="h3">
                {task.title}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {task.description}
              </Typography>
              <Box display="flex" alignItems="center" mt={1}>
                <Chip
                  label={task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                  size="small"
                  sx={{ backgroundColor: getPriorityColor(task.priority), color: 'white', mr: 1 }}
                />
                {task.dueDate && (
                  <Typography variant="body2" color="textSecondary">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </Typography>
                )}
              </Box>
            </Box>
            <Box>
              <IconButton onClick={() => onToggleComplete(task.id)} size="small">
                <CheckCircleIcon color={task.completed ? "primary" : "action"} />
              </IconButton>
              <IconButton onClick={() => onEdit(task)} size="small">
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => onDelete(task.id)} size="small">
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>
        </Paper>
      )}
    </Draggable>
  );
};

export default TaskItem;