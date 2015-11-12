var React = require('react');
var ReactDOM = require('react-dom');

// Add User button click
$('#btnAddUser').on('click', addUser);
// Add User
function addUser(event) {
	
	ReactDOM.render(
	React.createElement('h1', null, 'Hello, world!'),
	document.getElementById('example')
	);
	
    event.preventDefault();

	// If it is, compile all user info into one object
	var newUser = {
		'username': $('#addUser fieldset input#inputUserName').val(),
		'email': $('#addUser fieldset input#inputUserEmail').val()
	}

	// Use AJAX to post the object to our adduser service
	$.ajax({
		type: 'POST',
		data: newUser,
		url: '/media/adduser',
		dataType: 'JSON'
	}).done(function( response ) {

		// Check for successful (blank) response
		if (response.msg === '') {

			// Clear the form inputs
			$('#addUser fieldset input').val('');

			// Update the table
			//populateTable();

		}
		else {

			// If something goes wrong, alert the error message that our service returned
			alert('Error: ' + response.msg);

		}
	});
};


$('#btnUpdateThumbnails').on('click', updateThumbnails);
function updateThumbnails(event) {
    event.preventDefault();

	// Use AJAX to post the object to our adduser service
	$.ajax({
		type: 'POST',
		data: {},
		url: '/media/updatethumbnails',
		dataType: 'JSON'
	}).done(function( response ) {

		// Check for successful (blank) response
		if (response.msg === '') {
		}
		else {

			// If something goes wrong, alert the error message that our service returned
			alert('Error: ' + response.msg);

		}
	});
};