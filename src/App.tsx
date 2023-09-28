import React from 'react';
// import logo from './logo.svg';
import './App.css';
import ReportComponent from './components/report/report';

const App = () => {
  const tblReportId = '232d9ad2-24ff-4947-aaac-2443fdeb7322';
  const areaChartReportId = 'f2774993-8d1a-4034-9c02-feca7bd5d8be';
  const areaChartOneReportId = 'fadf9640-5c43-4076-8190-9a01e706a032';

  return (
    <div className="App">
      {/* <ReportComponent reportId={tblReportId} embedUrl={tblReportEmbedUrl} embedToken={embedToken} /> */}
      {/* <ReportComponent reportId={areaChartReportId} embedUrl={areaChartReportEmbedUrl} embedToken={embedToken} /> */}
      <ReportComponent reportId={areaChartOneReportId} />
    </div>
  );
}

export default App;
