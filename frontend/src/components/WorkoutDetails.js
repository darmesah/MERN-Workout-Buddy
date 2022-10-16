import useGlobalContext from '../context/WorkoutContext';
import { FaRegTrashAlt } from 'react-icons/fa';

// date fns
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

const WorkoutDetails = ({ _id, title, load, reps, createdAt }) => {
  const { deleteWorkout } = useGlobalContext();
  return (
    <div className="workout-details">
      <h4>{title}</h4>
      <p>
        <strong>Load (kg): </strong>
        {load}
      </p>
      <p>
        <strong>Reps: </strong>
        {reps}
      </p>
      <p>{formatDistanceToNow(new Date(createdAt), { addSuffix: true })}</p>
      <span onClick={() => deleteWorkout(_id)}>
        <FaRegTrashAlt />
      </span>
    </div>
  );
};

export default WorkoutDetails;
