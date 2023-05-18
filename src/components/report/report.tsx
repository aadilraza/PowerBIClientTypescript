import React, { useEffect, useRef } from 'react';
import { ReportProps } from './reportProps';
import { PowerBIEmbed } from 'powerbi-client-react';
import { Report, models } from 'powerbi-client';
import loaderGif from '../loader/giphy.gif';
import './report.css';

const ReportComponent: React.FC<ReportProps> = (props) => {

    const [embeddedReport, setEmbeddedReport] = React.useState<Report>();
    const embedToken = `eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ii1LSTNROW5OUjdiUm9meG1lWm9YcWJIWkdldyIsImtpZCI6Ii1LSTNROW5OUjdiUm9meG1lWm9YcWJIWkdldyJ9.eyJhdWQiOiJodHRwczovL2FuYWx5c2lzLndpbmRvd3MubmV0L3Bvd2VyYmkvYXBpIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvZDQ3MGJmN2QtM2RiYS00MjE2LWE4MWEtMTE2MDg3MWVhYjY0LyIsImlhdCI6MTY4NDQxNzc3OSwibmJmIjoxNjg0NDE3Nzc5LCJleHAiOjE2ODQ0MjMxNzMsImFjY3QiOjAsImFjciI6IjEiLCJhaW8iOiJBVlFBcS84VEFBQUFzVStyUlgzb2hiYzJqTTVNY2h0ci9HKzdvaFFTaHZhd3NiZWNIL3l4VGZWWlkwWlNQbkQ2OGJvNC9ueTR2S3JLUlgyNXhsTjdLSncvY3h3Y2pFSHZkWlhDYzNMNVRjNVIvTGFoK21RRFlERT0iLCJhbXIiOlsicHdkIiwibWZhIl0sImFwcGlkIjoiODcxYzAxMGYtNWU2MS00ZmIxLTgzYWMtOTg2MTBhN2U5MTEwIiwiYXBwaWRhY3IiOiIwIiwiaXBhZGRyIjoiMTEwLjkzLjIzNy4xMDUiLCJuYW1lIjoiS2FyYWNoaS1QQklwcm8iLCJvaWQiOiIzZTllN2VkZC0xNDljLTRmMDMtOGY4ZS1hOWFmNTA5ODIwZWEiLCJvbnByZW1fc2lkIjoiUy0xLTUtMjEtNTY3Mjk5OTkwLTM4NDk1OTIyMjItMTAxNjQ0ODgzOS0yMDIwIiwicHVpZCI6IjEwMDMyMDAyODlBQjg5MkEiLCJyaCI6IjAuQVN3QWZiOXcxTG85RmtLb0doRmdoeDZyWkFrQUFBQUFBQUFBd0FBQUFBQUFBQUFzQUF3LiIsInNjcCI6InVzZXJfaW1wZXJzb25hdGlvbiIsInNpZ25pbl9zdGF0ZSI6WyJrbXNpIl0sInN1YiI6Ijc3eWNtMmJOM2xzakV0eFY1OGZuU05PU0F0bTJ5WnVfdTd3Ujc0WWFTZTAiLCJ0aWQiOiJkNDcwYmY3ZC0zZGJhLTQyMTYtYTgxYS0xMTYwODcxZWFiNjQiLCJ1bmlxdWVfbmFtZSI6IkthcmFjaGktUEJJcHJvQGdldGFjdmlkZW81NTQzMS5vbm1pY3Jvc29mdC5jb20iLCJ1cG4iOiJLYXJhY2hpLVBCSXByb0BnZXRhY3ZpZGVvNTU0MzEub25taWNyb3NvZnQuY29tIiwidXRpIjoiS3gza1phUXhSRVdUUDBZUVRhSTFBQSIsInZlciI6IjEuMCIsIndpZHMiOlsiYjc5ZmJmNGQtM2VmOS00Njg5LTgxNDMtNzZiMTk0ZTg1NTA5Il19.HHq7q25H5F4Uf1UUL0JKmWqY7qatFDcSMXAw8CM_lVnf6sObpMTVZygSRfmfVXNRaVmRpzAwvY1gQxln4etoUMtyEAwZPmxjG2WF_safNY-OYsuIYLuQmmDvuW5WXCASI9ZFdjRHwRZk_VWAULzV9dO2487B0Jx0Lr6a1zARwZFNeVzUVttTDulKWf16CfoNj_GcnIlkdrtdS6bju9510xUE5NkTP0USZegwbqlX96lyHPbLXFDzrkk00L6pmGJsMuLvFUh7PAxxf-0f4llbJ8IkXkF4CXLOyx3tuL0yhhyz2HHjDkQCoPx66wvJVdWmwrY6ZyxAHtNuxnFR0NBnKA`;
    //NOTE: Copy token from PowerBI interface using command 'copy(powerBIAccessToken)'.
    const reportDomRef = useRef<HTMLDivElement>(null);
    const loaderDomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const reportElement = reportDomRef.current;
        if(reportElement) reportElement.style.visibility = 'hidden';

        const loaderElement = loaderDomRef.current;
        if(loaderElement) loaderElement.style.display = 'block';
    }, []);

    useEffect(() => {
        embeddedReport?.on("loaded", () => {
            console.info("Report Loaded");
            const reportElement = reportDomRef.current;
            if(reportElement) reportElement.style.visibility = 'visible';

            const loaderElement = loaderDomRef.current;
            if(loaderElement) loaderElement.style.display = 'none';
        });
        embeddedReport?.on("rendered", () => {
            console.info("Report Rendered");
        });
        return () => {
            embeddedReport?.off("loaded");
            embeddedReport?.off("rendered");
        };
    }, [embeddedReport]);


    const getNewEmbedToken = async () => {
        try {
            const authToken = ``; // NOTE: Need to set Authentication token, to call Power Bi Api. 
            const headers = {
                'Authorization': `Bearer ${authToken}`,
                'Content-type': 'application/json'
            };
            const body = {
                datasets: [{ id: "7dad2e90-3785-415f-92e5-030254a20530" }],
                report: [{ "allowEdit": false, "id": props.reportId }]
            };
            const response = await fetch('https://api.powerbi.com/v1.0/myorg/GenerateToken', {
                method: "POST",
                headers: headers,
                body: JSON.stringify(body),
            });
            if (response.status === 200) {
                const data = await response.json();
                const token = data.token;
                return token;
            } else {
                return null;
            }
        } catch (error) {
            return null;
        }
    }

    return (<>
        {/* {(!showReport) && <Loader />} */}
        <div id="container">
            <div id="overlay" ref={loaderDomRef}>
                <img id="spinner" alt="Alternate Text" src={loaderGif} />
            </div>
            <div ref={reportDomRef}>
                <PowerBIEmbed
                    cssClassName="embed-report"
                    embedConfig={{
                        type: 'report',   // Supported types: report, dashboard, tile, visual and qna
                        id: props.reportId,
                        embedUrl: props.embedUrl,
                        accessToken: embedToken,
                        tokenType: models.TokenType.Aad,
                        settings: {
                            panes: {
                                filters: {
                                    expanded: false,
                                    visible: false
                                }
                            },
                            background: models.BackgroundType.Transparent,
                            filterPaneEnabled: true,
                            navContentPaneEnabled: false
                        },
                        eventHooks: {
                            accessTokenProvider: getNewEmbedToken
                        }
                    }}
                    getEmbeddedComponent={(embeddedReport) => {
                        setEmbeddedReport(embeddedReport as Report);
                    }}
                />
            </div>
        </div>

    </>);
}

export default ReportComponent;