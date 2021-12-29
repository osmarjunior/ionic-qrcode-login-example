import React from 'react';
import './HomePage.css';
import { QRCode } from 'react-qrcode-logo';
import { io, Socket } from "socket.io-client";

class HomePage extends React.Component<any, any> {

  socket!: Socket;
  
  constructor(props:any) {
    super(props);
    this.state = {
      qrcode: ''
    }
  }

  componentDidMount() {

    this.socket = io("http://localhost:5000", { transports: ["websocket"] });

    this.socket.on("connect", () => {
      console.log("connect: " + this.socket.id);
      var hello = {
        op: 'hello'
      };
      this.socket.emit('message', JSON.stringify(hello));
    });

    this.socket.on('message',  (data) => {
      
      var obj = JSON.parse(data);
      console.log("Receivied:" + JSON.stringify(obj));

      if (obj.op == 'hello') {
        console.log("### Got hello token " + obj.token);

        //Generate QR Code and show to user.
        this.setState({
          qrcode: obj.token
        });
      } else if (obj.op == 'authdone') {
        console.log("### Got auth token " + obj.accessToken);
        this.props.history.push("/welcome");
        this.socket.disconnect();
      }

    });

    this.socket.on('error', function (data) {
      console.log(data || 'error');
    });

    this.socket.on('connect_failed', function (data) {
      console.log(data || 'connect_failed');
    });
  }

  render() {
    return (
      <div className="center" data-testid="HomePage">
        <QRCode value={this.state.qrcode} />
      </div>
    );
  }
}
export default HomePage;