import React from 'react';
// import logo from './logo.svg';
import './App.css';
import ReportComponent from './components/report/report';

const App = () => {
  return (
    <div className="App">
      <ReportComponent reportName="Assets" tenanatId="1" />
      <ReportComponent reportName="Assets" tenanatId="2" />
    </div>
  );
}

export default App;
