import React from 'react';
// import logo from './logo.svg';
import './App.css';
import ReportComponent from './components/report/report';
import DashboardComponent from './components/dashboard/dashboard';
import { models } from 'powerbi-client';

const App = () => {
  let filter: models.IBasicFilter = {
    $schema: "http://powerbi.com/product/schema#basic",
    filterType: models.FilterType.Basic,
    target: {
      table: "AssetStatus",
      column: "UserId"
    },
    operator: "In",
    values: [3],
  };

  const UnitStatusDashboardName = "UnitStatusDashboard";
  const MyCountsReportNames = "My Asset Counts";
  const AllCountsReportNames = "All Asset Counts";
  const AssetCategorizationByDate = "Asset Categorization By Date";
  const MyCountsReportNamesCssClass = "report-my-counts";
  const AllCountsReportNamesCssClass = "report-all-counts";
  const UnitStatusDashboardNameCssClass = "embed-dashboard";
  const AssetCategorizationByDateCssClass = "report-asset-categorization-by-date";

  return (
    <div className="App">
      <DashboardComponent dashboardName={UnitStatusDashboardName} className={UnitStatusDashboardNameCssClass} />
      <ReportComponent reportName={AllCountsReportNames} className={AllCountsReportNamesCssClass} />
      <ReportComponent reportName={AssetCategorizationByDate} className={AssetCategorizationByDateCssClass} /> 
      <ReportComponent reportName={MyCountsReportNames} filter={filter} className={MyCountsReportNamesCssClass} />
    </div>
  );
}

export default App;
