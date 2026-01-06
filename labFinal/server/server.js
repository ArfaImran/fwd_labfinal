const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()
const PORT = 8080

app.use(cors())
app.use(express.json())

mongoose.connect('mongodb+srv://233604_db_user:yourpass@cluster0.049ygsi.mongodb.net/?appName=Cluster0', {
}).then(() => console.log('MongoDB connected')).catch(err => console.error(err))

const workoutSchema = new mongoose.Schema({
  exerciseName: String,
  duration: Number,
  calories: Number,
  date: Date
})

const Workout = mongoose.model('Workout', workoutSchema)

app.get('/api/workouts', async (req, res) => {
  try {
    const workouts = await Workout.find()
    res.json(workouts)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/workouts', async (req, res) => {
  try {
    const workout = new Workout(req.body)
    await workout.save()
    res.status(201).json(workout)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

app.put('/api/workouts/:id', async (req, res) => {
  try {
    const workout = await Workout.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(workout)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

app.delete('/api/workouts/:id', async (req, res) => {
  try {
    await Workout.findByIdAndDelete(req.params.id)
    res.json({ message: 'Workout deleted' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))




