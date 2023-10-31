import React from 'react';
// import logo from './logo.svg';
import './App.css';
import ReportComponent from './components/report/report';
import { models } from 'powerbi-client';

const App = () => {
  const assetCountReportId = 'b519b417-91c2-446e-9659-587418f93532';
  const dashboardReportId = 'df4a643b-7c5a-4c62-99c0-6ab8c1b88b7b';
  const basicFilter: models.IBasicFilter = {
    $schema: "http://powerbi.com/product/schema#basic",
    filterType: models.FilterType.Basic,
    target: {
        table: "AssetCount",
        column: "UserId"
    },
    operator: "In",
    values: [5],
};

  return (
    <div className="App">
      <ReportComponent reportId={assetCountReportId} basicFilter={basicFilter}/>
      <ReportComponent reportId={dashboardReportId} basicFilter={basicFilter}/>
    </div>
  );
}

export default App;
