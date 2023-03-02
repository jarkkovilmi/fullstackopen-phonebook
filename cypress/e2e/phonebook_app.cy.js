describe('Phonebook', function() {
	it('front page can be opened', function() {
		cy.visit('http://localhost:8080')
		cy.contains('Phonebook')
		cy.contains('Add a new')
	})

	it('add button can be pressed', function() {
		cy.visit('http://localhost:8080')
		cy.contains('add').click()
		cy.contains('name or number missing')
	})
})