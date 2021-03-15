import logo from './logo.svg';
import React from 'react';
import './App.css';



class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userInput: ''
    }
    this.handleUserInput = this.handleUserInput.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
  }

  handleUserInput = (e) => {
    this.setState({
      userInput: e.target.value
    })
  }

  // Make search requests to the GET /search endpoint
  handleSearch = () => {
    console.log("Search button clicked!");
    let { userInput } = this.state;
    let url = '';
  }

  handleInputLabels = (e) => {
    let labelText = e.target.value;
    let labels = labelText.split(",");
    console.log("labels: ", labels);
  }

  // Upload
  handleUpload = (e) => {
    console.log("Upload files!")
  }


  render() {
    return (
      <div className="App">
        Search the Photos (Voice / Text)
        <br />
        <input placeholder="Enter something" onChange={this.handleUserInput}></input>
        <button onClick={this.handleSearch}> search</button>
        <br />
        <br />
        Upload the Photo
        <form
            encType="multipart/form-data"
            action="http://localhost:8080/upload"
            method="post"
            target="myFrame"
            >
            <input type="file" name="myFile" />
            {/* <input placeholder="Add labels here" onChange={}></input> */}
            <input type="submit" value="upload" onClick={this.handleSubmit} />
        </form>

        <iframe name="myFrame" height="0" width="0"></iframe>
        <br />

      </div>
    );
  }
}

export default App;
