var React = require('react');
var ReactDOM = require('react-dom');
var ReactList = require('react-list');
var Modal = require('react-modal');

class ImageListComponent extends React.Component {
  //state = {
  //  accounts: []
  //};

  componentWillMount() {

	this.setState({media: [ {} ]});
							
    $.get('media/filenames', function(result) {
	  this.setState({media: result});
      //if (this.isMounted()) {
      //  this.setState({
      //    username: lastGist.owner.login,
      //    lastGistUrl: lastGist.html_url
      //  });
      //}
	  }.bind(this)
	);
  }

// <a 		href={"/media/original/" + this.state.media[index]._id} target="_self">
  renderItem(index, key) {

	return (
		<div	style={{
					"display":"inline-block",
					"margin":"6px",
					 //"box-shadow":"10px 10px 5px grey"
					 "box-shadow":" 2px 2px 8px 0px rgba(99,99,99,1)"
					}}
				id={this.state.media[index]._id}
				onClick={openImagePopup} >
			
				<img	src={"media/thumbnail/" + this.state.media[index]._id}
						style={{
							"padding":"6px",
							//"box-shadow":"inset 2px 2px 8px 0px rgba(85,85,85,1)"
							}}
				/>
		</div>
	);
  }

  render() {
    return (
      <div>
        <div style={{overflow: 'auto', maxHeight: 400}}>
          <ReactList
            itemRenderer={this.renderItem.bind(this)}
			
            length={this.state.media.length}
            type='uniform'
			//type='variable'
			useTranslate3d={true}
          />
        </div>
      </div>
    );
  }
}

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

var ImagePopup = React.createClass({
 
  getInitialState: function() {
    return { modalIsOpen: false };
  },
 
  openModal: function(event) {
    this.setState({modalIsOpen: true, imageId: event.currentTarget.id});
  },
 
  closeModal: function() {
    this.setState({modalIsOpen: false});
  },
 
  render: function() {
    return (
      <div>
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          style={customStyles} >
          <img src={"/media/original/" + this.state.imageId} width="65%" onClick={this.closeModal} />
          <h2>Image ID: {this.state.imageId}</h2>
        </Modal>
      </div>
    );
  }
});

function openImagePopup(event) {
	//alert(event.currentTarget.id);
	var x = ReactDOM.render(<ImagePopup/>, document.getElementById('ImagePopupPlaceholder'));
	x.openModal(event);
}

// Add User button click
$('#btnAddUser').on('click', addUser);
// Add User
function addUser(event) {

	ReactDOM.render(
		//React.createElement('h1', null, 'Hello, world!'),
		React.createElement(ImageListComponent, null),
		document.getElementById('ImageListPlaceholder')
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