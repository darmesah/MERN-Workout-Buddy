import { createContext, useContext, useEffect, useReducer } from 'react';
import useAuthContext from '../hooks/useAuthContext';

const WorkoutsContext = createContext({
  workouts: [],
  addWorkout: (workout) => {},
  deleteWorkout: (_id) => {},
});

const workoutsReducer = (state, action) => {
  switch (action.type) {
    case 'SET_WORKOUTS':
      return action.payload;

    case 'CREATE_WORKOUT':
      return [action.payload, ...state];

    case 'DELETE_WORKOUT':
      return state.filter((workout) => workout._id !== action.payload);

    default:
      return state;
  }
};

export const WorkoutsContextProvider = ({ children }) => {
  const { user } = useAuthContext();
  const [workouts, dispatch] = useReducer(workoutsReducer, []);

  useEffect(() => {
    const fetchWorkouts = async () => {
      const response = await fetch('http://localhost:4000/api/workouts', {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const json = await response.json();

      if (response.ok) {
        dispatch({ type: 'SET_WORKOUTS', payload: json });
      }
    };

    if (user) {
      fetchWorkouts();
    }
  }, [dispatch, user]);

  const addWorkoutHandler = async (workout) => {
    const response = await fetch('http://localhost:4000/api/workouts', {
      method: 'POST',
      body: JSON.stringify(workout),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
    });

    const json = await response.json();

    if (!response.ok) {
      return {
        response: false,
        message: json.message,
        emptyFields: json.emptyFields,
      };
    }

    if (response.ok) {
      dispatch({ type: 'CREATE_WORKOUT', payload: json });
      return {
        response: true,
        message: ('new workout added ', json),
      };
    }
  };

  const deleteWorkoutHandler = async (_id) => {
    if (!user) {
      return;
    }

    const response = await fetch(`http://localhost:4000/api/workouts/${_id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });

    if (!response.ok) {
      return {
        response: false,
        message: 'Unable to delete workout',
      };
    }

    if (response.ok) {
      dispatch({ type: 'DELETE_WORKOUT', payload: _id });
      return {
        response: true,
        message: 'Workout Deleted',
      };
    }
  };

  const context = {
    workouts,
    addWorkout: addWorkoutHandler,
    deleteWorkout: deleteWorkoutHandler,
    dispatch,
  };

  return (
    <WorkoutsContext.Provider value={context}>
      {children}
    </WorkoutsContext.Provider>
  );
};

const useWorkoutContext = () => {
  return useContext(WorkoutsContext);
};
export default useWorkoutContext;
