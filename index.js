require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static('build'))

morgan.token('post-body', (request, _response) => {
	if (request.method === 'POST')
		return JSON.stringify(request.body)
	return null
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-body'))

app.get('/info', (_request, response, next) => {
	Person.find({})
		.then(persons => {
			response.send(
				`<div>Phonebook has info for ${persons.length} people</div>
				<div>${new Date()}</div>`
			)
		})
		.catch(error => next(error))
})

app.get('/api/persons', (_request, response, next) => {
	Person.find({})
		.then(persons => {
			response.json(persons)
		})
		.catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
	Person.findById(request.params.id)
		.then(person => {
			if (person) {
				response.json(person)
			} else {
				response.status(404).end()
			}
		})
		.catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
	Person.findByIdAndRemove(request.params.id)
		.then(() => {
			response.status(204).end()
		})
		.catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
	const body = request.body

	if (!body.name || !body.number) {
		return response.status(400).json({
			error: 'name or number missing'
		})
	}

	const person = new Person({
		name: body.name,
		number: body.number
	})
	person.save()
		.then(savedPerson => {response.json(savedPerson)})
		.catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
	const { name, number } = request.body

	Person.findByIdAndUpdate(
		request.params.id,
		{ name, number },
		{ new: true, runValidators: true, context: 'query' })
		.then(updatedPerson => {
			response.json(updatedPerson)
		})
		.catch(error => next(error))
})

const errorHandler = (error, _request, response, next) => {
	console.error(error.message)

	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformatted id' })
	}
	if (error.name === 'ValidationError') {
		return response.status(400).json({ error: error.message })
	}

	next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})