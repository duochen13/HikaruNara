import React, { useState, Component} from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import axios from 'axios';
import './App.css';
// install node v11: https://gist.github.com/d2s/372b5943bce17b964a79
// nvm use v10.24.0

function SearchBar(props) {
  let [talk, changeTalkState] = useState(false);
  let [searchInput, changeSearchInput] = useState("");
  let [objectKeys, changeObjectKeysState] = useState([]);

  const { transcript, resetTranscript } = useSpeechRecognition()

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return null
  }

  function startListening() {
    SpeechRecognition.startListening();
    changeTalkState(talk => !talk);
  }

  function stopListening() {
    SpeechRecognition.stopListening();
    changeTalkState(talk => !talk);
    changeSearchInput(searchInput => transcript);
  }

  // Search function definitations
  function searchInputOnChange(e) {
    changeSearchInput(searchInput => e.target.value);
  }

  function searchClickSubmit() {
    // Reset transcribe
    resetTranscript();
    // Reset objectKeys array first
    changeObjectKeysState(objectKeys => []);
    console.log("searchInput: ", searchInput);
    // GET request to API gateway
    // https://2okr71h4ab.execute-api.us-east-1.amazonaws.com/v1
    axios.get('https://2okr71h4ab.execute-api.us-east-1.amazonaws.com/v1/search', {
      params: {
        q: searchInput
      },
      options: {
        headers: { 
          "Access-Control-Allow-Origin": "*"
        }
      }
    })
    .then((response) => {
      const images = response.data.images; // {objectKey: labels:}
      console.log("images: ", images)
      images.forEach((image, index) => (
        // console.log("image.objectKey: ", image.objectKey, ", labels: ", image.labels)
        changeObjectKeysState(objectKeys => [...objectKeys, image])
      ));//forEach
      // console.log("get images: ", this.state.images);
    })//then
    .catch((error) => {
      console.log("Image not found in s3 error: ", error);
    })

    // reset temp user search input
    changeSearchInput(searchInput => '');
  }

  const photos = objectKeys.map((objectKey, index) => 
    <img key={index} src={`https://photo-cc-p2-bucket.s3.amazonaws.com/${objectKey}`} alt={index} />
  );

  return (
    <div>

      <input type="text" value={talk ? transcript : searchInput} 
             onChange={searchInputOnChange} placeholder="Search for photos"></input>

      {talk ? 
        <span>
          <button onClick={stopListening}>Stop</button>
        </span>
      :
        <span>
          <button onClick={startListening}>Talk</button>
        </span>
      }
      
      <button onClick={searchClickSubmit}>Search</button>
      
      <h1> {objectKeys.length === 0 ? "No Photos Found" : "Photos"} </h1>
      {photos}


    </div>
  )
}


class App extends Component {
  constructor(props) { 
    super(props);
    this.state = {
      // view variable
      uploadView: true,
      // Uploda vars
      success: false,
      url: "",
      tmpLabel: "",
      customLabels: [],
      // Search vars
      searchInput: "",
      images: [],
      objectKeys: []
    }
    // Select View
    this.selectUploadView = this.selectUploadView.bind(this);
    this.selectSearchView = this.selectSearchView.bind(this);
    // Upload funcs declarations
    this.handleChange = this.handleChange.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
    this.labelChange = this.labelChange.bind(this);
    this.addLabelClick = this.addLabelClick.bind(this);
    this.clearLabels = this.clearLabels.bind(this);
    // Search funcs declarations
    // this.searchInputChange = this.searchInputChange.bind(this);
    // this.searchClickSubmit = this.searchClickSubmit.bind(this);
   
  }

  // Transcribe
  handleTranscribe = () => {
    console.log("Handle Transcribe!");
  }

  // control upload / search view
  selectUploadView = () => {
    this.setState({
      uploadView: true
    });
    console.log("current uploadview: ", this.state.uploadView);
  }
  selectSearchView = () => {
    this.setState({
      uploadView: false
    })
    console.log("current uploadview: ", this.state.uploadView);
  }
  
  // upload function definitions
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
    let { customLabels } = this.state;
    console.log("fileName: ", fileName);
    console.log("fileType: ", fileType);
    console.log("customLabels: ", customLabels);
    // Prepare for the uplaod

    axios.post("http://localhost:3001/sign_s3",{
      fileName : fileName,
      fileType : fileType,
      Metadata: JSON.stringify(customLabels)
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
          // 'x-amz-meta-customLabels': customLabels[0]
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

  labelChange = (e) => {
    this.setState({ tmpLabel: e.target.value });
  }

  addLabelClick = () => {
    this.setState(prevState => ({
      customLabels: [...prevState.customLabels, this.state.tmpLabel]
    }));
    this.setState({ tmpLabel: "" });
  }

  clearLabels = () => {
    console.log("clear labels: ", this.state.customLabels);
    this.setState({ customLabels: [] });
  }

  // Search function definitations
  // searchInputChange = (e) => {
  //   this.setState({ searchInput: e.target.value });
  // }

  // searchClickSubmit = () => {
  //   // Reset images first
  //   this.setState({
  //     objectKeys: []
  //   })
  //   const { searchInput } = this.state;
  //   console.log("searchInput: ", searchInput);
  //   // GET request to API gateway
  //   // https://www.youtube.com/watch?v=uFsaiEhr1zs&t=467s
  //   axios.get('https://2okr71h4ab.execute-api.us-east-1.amazonaws.com/v1/search', {
  //     params: {
  //       q: searchInput
  //     },
  //     options: {
  //       headers: { 
  //         "Access-Control-Allow-Origin": "*"
  //       }
  //     }
  //   })
  //   .then((response) => {
  //     console.log("get response: ", response);
  //     const images = response.data.images; // {objectKey: labels:}
  //     images.forEach((image, index) => (
  //       // console.log("image.objectKey: ", image.objectKey, ", labels: ", image.labels)
  //       this.setState((prevState) => ({
  //         // imagess: [...prevState.images, {"objectKey":image.objectKey, "lables":image.labels}],
  //         objectKeys: [...prevState.objectKeys, image]
  //       }))
  //     ))//forEach
  //     // console.log("get images: ", this.state.images);
  //   })
  //   .catch((error) => {
  //     console.log("Image not found in s3 error: ", error);
  //   })

  //   // reset temp user search input
  //   this.setState({ searchInput: '' });
  // }


  render() {
    const customLabels = this.state.customLabels.map((label, index) =>
      <div className="label" key={index} >{label}</div>  
    );
    // const images = this.state.images.map((image, index) =>
    //   <img key={index} src={`https://photo-cc-p2-bucket.s3.amazonaws.com/${image.objectKey}`} alt={index} />
    // )
    // const objectKeys = this.state.objectKeys.map((objectKey, index) =>
    //   <img key={index} src={`https://photo-cc-p2-bucket.s3.amazonaws.com/${objectKey}`} alt={index} />
    // )

    const uploadView = this.state.uploadView;

    return(
      <div className="App">
        <div className="viewButton">
          <button id={uploadView ? "select" : ""} onClick={this.selectUploadView}>Upload</button>
          {/* <button onClick={this.selectUploadView}>Upload</button> */}
          <button id={uploadView ? "" : "select"} onClick={this.selectSearchView}>Search</button>
        </div>
        
        {uploadView ? 
          <div>

            <h1>Upload the Photo</h1>
              <input type="file" onChange={this.handleChange} ref={(ref) => { this.uploadInput = ref; }} />
              <br />

              <input type="text" value={this.state.tmpLabel} onChange={this.labelChange} placeholder="Enter labels"></input>
              <button onClick={this.handleUpload}>UPLOAD</button>
              <br />

              <button onClick={this.addLabelClick}>Add Labels</button>
              <button onClick={this.clearLabels}>Clear Labels</button>
              <br />
              
              <div className="customLabels">
                {customLabels}
              </div>

              <br />
              {this.state.success ? 
                "Success!" : ""
              }
              <br />

          </div>
          
          :
      
          <div>

            <h1>Search for Photo</h1>
              {/* <input type="text" value={this.state.searchInput} onChange={this.searchInputChange} placeholder="Search for photos"></input>
              <button onClick={this.searchClickSubmit}>Search</button> */}

              <SearchBar/>


           </div>
        }

      </div>
    )
  }
}

export default App;



// https://medium.com/@khelif96/uploading-files-from-a-react-app-to-aws-s3-the-right-way-541dd6be689