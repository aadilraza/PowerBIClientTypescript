import React, { useEffect, useRef, useState } from 'react';
import { PowerBIEmbed } from 'powerbi-client-react';
import { Report, models } from 'powerbi-client';
import loaderGif from '../loader/giphy.gif';
import './report.css';
import axios from 'axios';
import { ReportProps } from './reportProps';

const ReportComponent: React.FC<ReportProps> = ({ reportName, tenanatId }) => {
    const [embeddedApiResponse, setEmbeddedApiResponse] = useState<{ embedUrl: string | undefined, accessToken: string | undefined, reportId: string | undefined }>({ embedUrl: undefined, accessToken: undefined, reportId : undefined });
    const [embeddedReport, setEmbeddedReport] = useState<Report>();
    const reportDomRef = useRef<HTMLDivElement>(null);
    const loaderDomRef = useRef<HTMLDivElement>(null);
    const apiUrl = 'https://localhost:7232/api/Home/GetEmbedTokenURL';
    useEffect(() => {
        const reportElement = reportDomRef.current;
        if (reportElement) reportElement.style.visibility = 'hidden';

        const loaderElement = loaderDomRef.current;
        if (loaderElement) loaderElement.style.display = 'block';

        getEmbedToken();
    }, []);

    useEffect(() => {
        embeddedReport?.on("loaded", () => {
            console.info("Report Loaded");
            const reportElement = reportDomRef.current;
            if (reportElement) reportElement.style.visibility = 'visible';

            const loaderElement = loaderDomRef.current;
            if (loaderElement) loaderElement.style.display = 'none';
        });
        embeddedReport?.on("rendered", () => {
            console.info("Report Rendered");
        });
        return () => {
            embeddedReport?.off("loaded");
            embeddedReport?.off("rendered");
        };
    }, [embeddedReport]);


    const getEmbedToken = () => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        };
        const _apiUrl = `${apiUrl}?tenantId=${tenanatId}&reportName=${reportName}`;
        axios.get(_apiUrl, config)
            .then(({ data }) => {
                setEmbeddedApiResponse({
                    embedUrl: data.embedUrl,
                    accessToken: data.token,
                    reportId : data.reportId
                });
            })
            .catch(error => console.error(error));
    }

    let embedConfiguration = {
        type: 'report',
        id: embeddedApiResponse?.reportId,
        embedUrl: embeddedApiResponse?.embedUrl,
        accessToken: embeddedApiResponse?.accessToken,
        tokenType: models.TokenType.Embed,
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
        // eventHooks: {
        //     accessTokenProvider: getEmbedToken
        // }
    };

    return (
        <div id="container">
            <div id="overlay" ref={loaderDomRef}>
                <img id="spinner" alt="Alternate Text" src={loaderGif} />
            </div>
            <div ref={reportDomRef}>
                <PowerBIEmbed
                    cssClassName="embed-report"
                    embedConfig={embedConfiguration}
                    getEmbeddedComponent={(embeddedReport) => {
                        setEmbeddedReport(embeddedReport as Report);
                    }}
                />
            </div>
        </div>
    );
}

export default ReportComponent;