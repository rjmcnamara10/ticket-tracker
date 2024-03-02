import React from 'react';
import { AmplifyAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to My AWS Amplify React App</h1>
        <p>This is an example text displayed using AWS Amplify UI React.</p>
        <AmplifyAuthenticator>
          <AmplifySignOut />
        </AmplifyAuthenticator>
      </header>
    </div>
  );
}

export default App;