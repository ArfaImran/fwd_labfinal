import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'


function App() {
 
  const [exerciseName, setExerciseName] = useState('')
  const [duration, setDuration] = useState('')
  const [calories, setCalories] = useState('')
  const [date, setDate] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [workouts, setWorkouts] = useState([])

  const API_BASE = 'http://localhost:27017/api/workouts'

  useEffect(() => {
  
    fetchWorkouts()

  }, [])

  const fetchWorkouts = async () => {
    try {
      const response = await fetch(API_BASE)
      const data = await response.json()
      setWorkouts(data)
    } catch (error) {
      console.error('Error fetching workouts:', error)
    }
  }

  const addWorkout = async () => {
    try {
      const response = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exerciseName, duration: parseInt(duration), calories: parseInt(calories), date })
      })
      if (response.ok) {
        fetchWorkouts()
        resetForm()
      }
    } catch (error) {
      console.error('Error adding workout:', error)
    }
  }

  const updateWorkout = async () => {
    try {
      const response = await fetch(`${API_BASE}/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exerciseName, duration: parseInt(duration), calories: parseInt(calories), date })
      })
      if (response.ok) {
        fetchWorkouts()
        resetForm()
      }
    } catch (error) {
      console.error('Error updating workout:', error)
    }
  }

  const deleteWorkout = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' })
      if (response.ok) {
        fetchWorkouts()
      }
    } catch (error) {
      console.error('Error deleting workout:', error)
    }
  }

  const editWorkout = (workout) => {
    setExerciseName(workout.exerciseName)
    setDuration(workout.duration)
    setCalories(workout.calories)
    setDate(workout.date)
    setEditingId(workout._id)
  }

  const resetForm = () => {
    setExerciseName('')
    setDuration('')
    setCalories('')
    setDate('')
    setEditingId(null)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingId) {
      updateWorkout()
    } else {
      addWorkout()
    }
  }

  return (
    <div className="container mt-5">

      <h1 className="mb-4">Workout Tracker</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="row g-3">
          <div className="col-md-3">
            <label htmlFor="exerciseName" className="form-label">Exercise Name</label>
            <input
              type="text"
              className="form-control"
              id="exerciseName"
              value={exerciseName}
              onChange={(e) => setExerciseName(e.target.value)}
              required
            />
          </div>
          <div className="col-md-3">
            <label htmlFor="duration" className="form-label">Duration (minutes)</label>
            <input
              type="number"
              className="form-control"
              id="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
            />
          </div>
          <div className="col-md-3">
            <label htmlFor="calories" className="form-label">Calories Burned</label>
            <input
              type="number"
              className="form-control"
              id="calories"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              required
            />
          </div>
          <div className="col-md-3">
            <label htmlFor="date" className="form-label">Date</label>
            <input
              type="date"
              className="form-control"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
        </div>
        <button type="submit" className="btn btn-primary mt-3">
          {editingId ? 'Update Workout' : 'Add Workout'}
        </button>
        {editingId && (
          <button type="button" className="btn btn-secondary mt-3 ms-2" onClick={resetForm}>
            Cancel
          </button>
        )}
      </form>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Exercise Name</th>
            <th>Duration (minutes)</th>
            <th>Calories Burned</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
 
          {workouts.map((workout) => (
            <tr key={workout._id}>
              <td>{workout.exerciseName}</td>
              <td>{workout.duration}</td>
              <td>{workout.calories}</td>
              <td>{new Date(workout.date).toLocaleDateString()}</td>
              <td>
                <button className="btn btn-warning btn-sm me-2" onClick={() => editWorkout(workout)}>
                  Edit
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => deleteWorkout(workout._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default App