const initialState = {
    tasks: JSON.parse(localStorage.getItem('tasks')) || [],
    nextId: parseInt(localStorage.getItem('nextId')) || 1
  };
  
  const taskReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'ADD_TASK':
        return {
          ...state,
          tasks: [...state.tasks, { ...action.payload, id: state.nextId }],
          nextId: state.nextId + 1
        };
      case 'EDIT_TASK':
        return {
          ...state,
          tasks: state.tasks.map(task => 
            task.id === action.payload.id ? action.payload : task
          )
        };
      case 'DELETE_TASK':
        return {
          ...state,
          tasks: state.tasks.filter(task => task.id !== action.payload)
        };
      case 'TOGGLE_COMPLETE':
        return {
          ...state,
          tasks: state.tasks.map(task => 
            task.id === action.payload ? { ...task, completed: !task.completed } : task
          )
        };
      case 'REORDER_TASKS':
        return {
          ...state,
          tasks: action.payload
        };
      default:
        return state;
    }
  };
  
  export default taskReducer;