import React from 'react';
import './WelcomePage.css';

class WelcomePage extends React.Component<any, any> {
  render() {
    return (
      <div className="center" data-testid="WelcomePage">
        <h1>Bem Vindo!!</h1>
      </div>
    );
  }
}
export default WelcomePage;