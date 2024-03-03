import React from 'react';
import { Helmet } from 'react-helmet';
import './App.css';

function App() {
  return (
    <div className="App">
      <Helmet>
        <title>Ticket Track</title>
        <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
      </Helmet>
      <header className="App-header">
        <img src="/logo192.png" alt="Logo" className="logo" />
        <img src="/title.png" alt="Logo" className="title" />
      </header>
      <div className="Main-content">
        <p>This is an example text displayed using AWS Amplify UI React.</p>
      </div>
    </div>
  );
}

export default App;