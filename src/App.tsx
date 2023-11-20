import React from 'react';
// import logo from './logo.svg';
import './App.css';
import ReportComponent from './components/report/report';
import { models } from 'powerbi-client';

const App = () => {
  const dashboardReportId = 'f4038630-867b-4d7b-9147-6882a6a8fe06';
  const filter: models.IBasicFilter = {
    $schema: "http://powerbi.com/product/schema#basic",
    filterType: models.FilterType.Basic,
    target: {
        table: "AssetStatus",
        column: "UserId"
    },
    operator: "In",
    values: [3],
};

  return (
    <div className="App">
      <ReportComponent reportId={dashboardReportId} filter={filter}/>
    </div>
  );
}

export default App;
