import React, { useState, useEffect } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Container, 
  Paper, 
  Button, 
  Box, 
  IconButton, 
  Dialog, 
  DialogContent, 
  DialogTitle,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  useMediaQuery,
  CssBaseline
} from '@mui/material';
import { 
  Add as AddIcon, 
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Assignment as AssignmentIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import store from './redux/store';
import TaskForm from './components/TaskForm';
import TaskItem from './components/TaskItem';
import TaskFilters from './components/TaskFilters';
import { addTask, editTask, deleteTask, toggleComplete, reorderTasks } from './redux/actions';

// Theme setup
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

// Main App Component
const TaskApp = () => {
  const [open, setOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    sortBy: 'dueDate'
  });
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  const dispatch = useDispatch();
  const tasks = useSelector(state => state.tasks);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('nextId', tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1);
  }, [tasks]);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleAddTask = () => {
    setCurrentTask(null);
    setOpen(true);
  };

  const handleEditTask = (task) => {
    setCurrentTask(task);
    setOpen(true);
  };

  const handleDeleteTask = (id) => {
    dispatch(deleteTask(id));
  };

  const handleToggleComplete = (id) => {
    dispatch(toggleComplete(id));
  };

  const handleSaveTask = (task) => {
    if (task.id) {
      dispatch(editTask(task));
    } else {
      dispatch(addTask(task));
    }
    setOpen(false);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters({
      ...filters,
      [filterName]: value
    });
  };

  const handleSortChange = (sortBy) => {
    setFilters({
      ...filters,
      sortBy
    });
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    const items = Array.from(filteredTasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    // Update the order in the actual tasks array
    const newTasks = [...tasks];
    const itemIds = items.map(item => item.id);
    const sortedTasks = newTasks.sort((a, b) => {
      return itemIds.indexOf(a.id) - itemIds.indexOf(b.id);
    });
    
    dispatch(reorderTasks(sortedTasks));
  };

  // Apply filters and sorting
  const filteredTasks = tasks.filter(task => {
    if (filters.status === 'active' && task.completed) return false;
    if (filters.status === 'completed' && !task.completed) return false;
    if (filters.priority !== 'all' && task.priority !== filters.priority) return false;
    return true;
  }).sort((a, b) => {
    if (filters.sortBy === 'priority') {
      const priorityOrder = { high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    if (filters.sortBy === 'dueDate') {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    if (filters.sortBy === 'title') {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Task Manager
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        <ListItem button>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button selected>
          <ListItemIcon>
            <AssignmentIcon />
          </ListItemIcon>
          <ListItemText primary="Tasks" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Task Management App
          </Typography>
          <Button 
            color="inherit" 
            startIcon={<AddIcon />}
            onClick={handleAddTask}
          >
            {isMobile ? '' : 'Add Task'}
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? drawerOpen : true}
        onClose={handleDrawerToggle}
        sx={{
          width: 240,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box' },
        }}
      >
        {drawer}
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - 240px)` },
        }}
      >
        <Toolbar />
        <Container maxWidth="lg">
          <Box sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
              Tasks
            </Typography>
            <TaskFilters 
              filters={filters} 
              onFilterChange={handleFilterChange}
              onSortChange={handleSortChange}
            />
            
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="tasks">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {filteredTasks.length > 0 ? (
                      filteredTasks.map((task, index) => (
                        <TaskItem
                          key={task.id}
                          task={task}
                          index={index}
                          onEdit={handleEditTask}
                          onDelete={handleDeleteTask}
                          onToggleComplete={handleToggleComplete}
                        />
                      ))
                    ) : (
                      <Paper sx={{ p: 4, textAlign: 'center' }}>
                        <Typography variant="h6">No tasks found</Typography>
                        <Typography variant="body2" color="textSecondary">
                          Try adjusting your filters or add a new task
                        </Typography>
                        <Button
                          variant="contained"
                          color="primary"
                          startIcon={<AddIcon />}
                          onClick={handleAddTask}
                          sx={{ mt: 2 }}
                        >
                          Add Task
                        </Button>
                      </Paper>
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </Box>
        </Container>
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{currentTask ? 'Edit Task' : 'Add Task'}</DialogTitle>
        <DialogContent>
          <TaskForm
            initialTask={currentTask}
            onSave={handleSaveTask}
            onClose={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

// Wrap the main app with providers
const TaskManagementApp = () => {
  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <TaskApp />
      </Provider>
    </ThemeProvider>
  );
};

export default TaskManagementApp;