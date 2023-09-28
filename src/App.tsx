import React from 'react';
// import logo from './logo.svg';
import './App.css';
import ReportComponent from './components/report/report';

const App = () => {
  const tblReportId = '96642825-6f98-4d7a-aa02-d710c1e66149';
  const dashBoardDownloadedReportId = 'c371310a-f123-455c-a930-03e97e7ac119';
  const areaChartOneReportId = 'fadf9640-5c43-4076-8190-9a01e706a032';

  return (
    <div className="App">
      <ReportComponent reportId={tblReportId} />
      <ReportComponent reportId={dashBoardDownloadedReportId} />
      <ReportComponent reportId={areaChartOneReportId} />
    </div>
  );
}

export default App;
