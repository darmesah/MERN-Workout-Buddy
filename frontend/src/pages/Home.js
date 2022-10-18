import WorkoutDetails from '../components/WorkoutDetails';
import WorkoutForm from '../components/WorkoutForm';
import useWorkoutContext from '../context/WorkoutContext';

const Home = () => {
  const { workouts } = useWorkoutContext();

  return (
    <div className="home">
      <div className="workouts">
        {workouts &&
          workouts.map((workout) => {
            return <WorkoutDetails key={workout._id} {...workout} />;
          })}
      </div>
      <WorkoutForm />
    </div>
  );
};

export default Home;
