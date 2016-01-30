var React = require('react');
var ReactDOM = require('react-dom');
var ReactList = require('react-list');
var Modal = require('react-modal');

class ImageListComponent extends React.Component {

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

  renderItem(index, key) {
	return (
		<div	style={{
					"display":"inline-block",
					"margin":"6px",
                    "boxShadow":" 2px 2px 8px 0px rgba(99,99,99,1)"
					}}
				id={this.state.media[index]._id}
                data-filename={this.state.media[index].filename}
				onClick={openImagePopup} >
			
				<img	src={"media/thumbnail/" + this.state.media[index]._id}
						style={{
							"padding":"6px"
							}}
				/>
		</div>
	);
  }

  render() {
    return (
        <div style={{overflow: 'auto', height: '100%'}}>
          <ReactList
            itemRenderer={this.renderItem.bind(this)}
			
            length={this.state.media.length}
            type='uniform'
			//type='variable'
			useTranslate3d={true}
          />
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
    this.setState({modalIsOpen: true, imageId: event.currentTarget.id, filename: event.currentTarget.dataset.filename});
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
          <h2>File: {this.state.filename}</h2>
        </Modal>
      </div>
    );
  }
});

function openImagePopup(event) {
	//alert(event.currentTarget.id);
	var popup = ReactDOM.render(<ImagePopup/>, document.getElementById('ImagePopupPlaceholder'));
	popup.openModal(event);
}

// Add button click handler.
$('#btnLoadImageGrid').on('click', loadImageGrid);
$(document).ready(loadImageGrid);

// Load the main grid of photos.
function loadImageGrid(event) {

	ReactDOM.render(
		React.createElement(ImageListComponent, null),
		document.getElementById('ImageListPlaceholder')
	);
	
    event.preventDefault();
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