import React, { useEffect, useRef } from 'react';
import { ReportProps } from './reportProps';
import { PowerBIEmbed } from 'powerbi-client-react';
import { Report, models } from 'powerbi-client';
import loaderGif from '../loader/giphy.gif';
import './report.css';

const ReportComponent: React.FC<ReportProps> = (props) => {

    const [embeddedReport, setEmbeddedReport] = React.useState<Report>();
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
                        accessToken: props.embedToken,
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