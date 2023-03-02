const Persons = ({ filter, persons, deletePerson }) => {
	const filteredPersons = persons.filter((person) => 
		person.name.toLowerCase().includes(filter.toLowerCase()))

	return filteredPersons.map(person => 
		<div key={person.id}>{person.name} {person.number}&nbsp;
			<button onClick={() => deletePerson(person)}>delete</button>
		</div>)
}

export default Persons