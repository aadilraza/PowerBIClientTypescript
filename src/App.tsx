import React from 'react';
// import logo from './logo.svg';
import './App.css';
import ReportComponent from './components/report/report';

function App() {

  const ReportId = '2f48663a-3d9b-4789-a5f8-a007081e0dcf';
  const ReportIdTwo = '4ac1d6a4-9991-4b0b-9e73-ad2faed5b474';
  // const GroupId = '26260d92-d016-47da-8308-b5d4283d4112';
  // const EmbedUrl = `https://app.powerbi.com/reportEmbed?reportId=${ReportId}&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9XQUJJLVVTLU5PUlRILUNFTlRSQUwtRy1QUklNQVJZLXJlZGlyZWN0LmFuYWx5c2lzLndpbmRvd3MubmV0IiwiZW1iZWRGZWF0dXJlcyI6eyJtb2Rlcm5FbWJlZCI6dHJ1ZSwidXNhZ2VNZXRyaWNzVk5leHQiOnRydWV9fQ%3d%3d`;
  const EmbedUrlTwo = `https://app.powerbi.com/reportEmbed?reportId=${ReportId}&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9XQUJJLVVTLU5PUlRILUNFTlRSQUwtRy1QUklNQVJZLXJlZGlyZWN0LmFuYWx5c2lzLndpbmRvd3MubmV0IiwiZW1iZWRGZWF0dXJlcyI6eyJtb2Rlcm5FbWJlZCI6dHJ1ZSwidXNhZ2VNZXRyaWNzVk5leHQiOnRydWV9fQ%3d%3d`;

  return (
    <div className="App">
      <ReportComponent reportId={ReportIdTwo} embedUrl={EmbedUrlTwo} />
    </div>
  );
}

export default App;
