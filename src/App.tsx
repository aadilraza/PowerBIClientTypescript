import React from 'react';
// import logo from './logo.svg';
import './App.css';
import ReportComponent from './components/report/report';
import DashboardComponent from './components/dashboard/dashboard';
import { models } from 'powerbi-client';

const App = () => {
  const dashboardReportId = 'f4038630-867b-4d7b-9147-6882a6a8fe06';
  const dashboardId = 'b65a7389-f34f-45af-ae98-035f5eecfe95';
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
      {/* <ReportComponent reportId={dashboardReportId} filter={filter}/> */}
      <DashboardComponent dashboardId={dashboardId} />
    </div>
  );
}

export default App;
