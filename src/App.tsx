import React from 'react';
// import logo from './logo.svg';
import './App.css';
import ReportComponent from './components/report/report';

const App = () => {
  const assetCountReportId = 'b519b417-91c2-446e-9659-587418f93532';

  return (
    <div className="App">
      <ReportComponent reportId={assetCountReportId} />
    </div>
  );
}

export default App;
