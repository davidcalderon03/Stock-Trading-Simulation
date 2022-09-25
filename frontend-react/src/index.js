import React from 'react';
import ReactDOM from 'react-dom/client';  //supposed to add /client
import App from "./components/App";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<h1>Hello World</h1>);
root.render(<App />);