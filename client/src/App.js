import React, { Component } from "react";
import socketIOClient from "socket.io-client";

class App extends Component {
  constructor() {
    super();
    this.state = {
      response: false,
      request: false,
      endpoint: "http://localhost:4001"
    };
    this.name = null;
    this.description = null;
    this.sendDataToApi = this.sendDataToApi.bind(this);
  }

  componentDidMount() {
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);
    socket.on("FromAPI", data => {
      this.setState({ response: data }); 
      console.log('received', data);
    });
    socket.on("ReceivePacket", data => {
      console.log('sent', data)
      this.setState({ request: data });
    });
  }

  sendDataToApi(event) {
    event.preventDefault();
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);
    socket.emit("FromClient",{"name": this.name.value, "description": this.description.value});
    console.log('emitted: ', this.name.value, this.description.value);
    this.name.value = '';
    this.description.value = '';
  }

  render() {
    const { response } = this.state;
    return (
      <div style={{ textAlign: "center" }}>
        <form onSubmit={this.sendDataToApi}>
          <input id="name" ref={(input) => {this.name = input;}} />
          <input id="description" ref={(input) => {this.description = input;}} />
          <button type="submit">Post</button>

        </form>
        {response
          ? response.map((record, index) =>
          <p key={index}>
            {record.name}: {record.description}
          </p>)
          : <p>Loading...</p>}
      </div>
    );
  }
}

export default App;