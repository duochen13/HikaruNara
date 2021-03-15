import React, {Component} from 'react';
import axios from 'axios';
import './App.css';
// install node v11: https://gist.github.com/d2s/372b5943bce17b964a79

class App extends Component {
  constructor(props) { 
    super(props);
    this.state = {
      success: false,
      url: ""
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
  }

  handleChange = (e) => {
    this.setState({
      success: false,
      url: ""
    });
  }

  handleUpload = (e) => {
    let file = this.uploadInput.files[0];
    console.log("file: ", file)
    // Split the filename to get the name and type, ex: test.jpg
    let fileParts = this.uploadInput.files[0].name.split('.');
    let fileName = fileParts[0];
    let fileType = fileParts[1];
    console.log("fileName: ", fileName);
    console.log("fileType: ", fileType);
    // Prepare for the uplaod
    axios.post("http://localhost:3001/sign_s3",{
      fileName : fileName,
      fileType : fileType
    })
    .then(response => {
      var returnData = response.data.data.returnData;
      var signedRequest = returnData.signedRequest;
      var url = returnData.url;
      console.log("returnData url: ", url);
      this.setState({
        url: url
      })
      console.log("received a signed request: " + signedRequest);
      // ex: https://photo-cc-p2-bucket.s3.amazonaws.com/exam?AWSAccessKeyId=AKIAQ6O4UIK5NQU5LCER&Content-Type=jpg&Expires=1615789091&Signature=XGCWXM96vEtU%2FsBO6zeh%2B4NELfs%3D&x-amz-acl=public-read

      // Add fileTypevar options = {} and CORS HEADER in the HEADERS
      var options = {
        headers: {
          'Access-Control-Allow-Origin': "*",
          'Content-Type': fileType
        }
      };
      axios.put(signedRequest, file, options)
      .then(result => {
        console.log("Response from S3: ", result);
        this.setState({
          success: true
        })
        // .catch(err => {
        //   console.log("ERROR: ", err);
        // })
      })//.then(result)
    }).catch(err => {
      console.log("ERROR: ", err);
    })
  }

  render() {
    return(
      <div>
        <h1>Upload a File</h1>
        <input onChange={this.handleChange} ref={(ref) => { this.uploadInput = ref; }} type="file" />
        <br />
        <button onClick={this.handleUpload}>UPLOAD</button>
        <br />
        {this.state.success ? 
          "Success!" : "Failed"
        }
      </div>
    )
  }
}

export default App;

// class App extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       userInput: ''
//     }
//     this.handleUserInput = this.handleUserInput.bind(this);
//     this.handleSearch = this.handleSearch.bind(this);
//     this.handleUpload = this.handleUpload.bind(this);
//   }

//   handleUserInput = (e) => {
//     this.setState({
//       userInput: e.target.value
//     })
//   }

//   // Make search requests to the GET /search endpoint
//   handleSearch = () => {
//     console.log("Search button clicked!");
//     let { userInput } = this.state;
//     let url = '';
//   }

//   handleInputLabels = (e) => {
//     let labelText = e.target.value;
//     let labels = labelText.split(",");
//     console.log("labels: ", labels);
//   }

//   // Upload
//   handleUpload = (e) => {
//     console.log("Upload files!")
//     const config = {
//       bucketName: 'photo-cc-p2-bucket',
//       dirName: 'folder1', /* optional */
//       region: 'use-east-1',
//       accessKeyId: 'AKIAQ6O4UIK5NQU5LCE',
//       secretAccessKey: 'YX0bCPJPOzfaAZr7f1R61rOR7RMd5KAlk7RD6Qf'
//     }
//   }


//   render() {
//     return (
//       <div className="App">
//         Search the Photos (Voice / Text)
//         <br />
//         <input placeholder="Enter something" onChange={this.handleUserInput}></input>
//         <button onClick={this.handleSearch}> search</button>
//         <br />
//         <br />
//         Upload the Photo
//         <form
//             encType="multipart/form-data"
//             action="http://localhost:8080/upload"
//             method="post"
//             target="myFrame"
//             >
//             <input type="file" name="myFile" />
//             {/* <input placeholder="Add labels here" onChange={}></input> */}
//             <input type="submit" value="upload" onClick={this.handleUpload} />
//         </form>

//         <iframe name="myFrame" height="0" width="0"></iframe>
//         <br />

//       </div>
//     );
//   }
// }

// export default App;


// https://medium.com/@khelif96/uploading-files-from-a-react-app-to-aws-s3-the-right-way-541dd6be689