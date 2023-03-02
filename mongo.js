const mongoose = require('mongoose')

mongoose.set('strictQuery', true)

if (process.argv.length<3) {
	console.log('give password as an argument')
	process.exit(1)
}

const password = process.argv[2]
const name =  process.argv[3]
const number = process.argv[4]

const url =
	`mongodb+srv://fullstack:${password}@cluster0.lzturld.mongodb.net/personApp?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
	name: String,
	number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length > 3) {
	const person = new Person({
		name: name,
		number: number
	})

	person.save().then(result => {
		console.log(result)
		console.log(`added ${person.name} number ${person.number} to phonebook`)
		mongoose.connection.close()
	})
}

if (process.argv.length === 3) {
	Person.find({}).then(person => {
		console.log('phonebook:')
		person.forEach(person => {
			console.log(`${person.name} ${person.number}`)
		})
		mongoose.connection.close()
	})
}
