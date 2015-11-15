var React = require('react');
var ReactDOM = require('react-dom');
var ReactList = require('react-list');

class MyComponent extends React.Component {
  //state = {
  //  accounts: []
  //};

  componentWillMount() {
    //loadAccounts(this.handleAccounts.bind(this));
	this.setState({accounts: [	
								{'_id':'5648cbb7e490e2884b52d6db'}
							]});
							
    $.get('media/filenames', function(result) {
	  this.setState({accounts: result});
      //if (this.isMounted()) {
      //  this.setState({
      //    username: lastGist.owner.login,
      //    lastGistUrl: lastGist.html_url
      //  });
      //}
	  }.bind(this)
	);
  }

  //handleAccounts(accounts) {
  //  this.setState({accounts: [{'name':'one'},{'name':'two'},{'name':'three'}]});
  //}

  renderItem(index, key) {
    //return (<div key={key}>{this.state.accounts[index].name}</div>);
	//return (<object data={"media?name=" + this.state.accounts[index]._id} />);
	//return (<object data={"media?name=" + this.state.accounts[index]._id} type="image/jpg" />);
	return (<div><img src={"media?name=" + this.state.accounts[index]._id} /></div>);
  }

  render() {
    return (
      <div>
        <h1>Accounts</h1>
        <div style={{overflow: 'auto', maxHeight: 400}}>
          <ReactList
            itemRenderer={this.renderItem.bind(this)}
            length={this.state.accounts.length}
            type='uniform'
          />
        </div>
      </div>
    );
  }
}

// Add User button click
$('#btnAddUser').on('click', addUser);
// Add User
function addUser(event) {

	ReactDOM.render(
	//React.createElement('h1', null, 'Hello, world!'),
	React.createElement(MyComponent, null),
	document.getElementById('example')
	);
	
    event.preventDefault();

	// If it is, compile all user info into one object
	//var newUser = {
	//	'username': $('#addUser fieldset input#inputUserName').val(),
	//	'email': $('#addUser fieldset input#inputUserEmail').val()
	//}

	// Use AJAX to post the object to our adduser service
	//$.ajax({
	//	type: 'POST',
	//	data: newUser,
	//	url: '/media/adduser',
	//	dataType: 'JSON'
	//}).done(function( response ) {

	//	// Check for successful (blank) response
	//	if (response.msg === '') {
//
	//		// Clear the form inputs
	//		$('#addUser fieldset input').val('');
//
	//		// Update the table
	//		//populateTable();
//
		//}
		//else {
//
	//		// If something goes wrong, alert the error message that our service returned
	//		alert('Error: ' + response.msg);

	//	}
	//});
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