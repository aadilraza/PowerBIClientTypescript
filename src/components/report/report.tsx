import React, { useEffect, useRef, useState } from 'react';
import { PowerBIEmbed } from 'powerbi-client-react';
import { Report, models } from 'powerbi-client';
import loaderGif from '../loader/giphy.gif';
import './report.css';
import axios from 'axios';
import { ReportProps } from './reportProps';

const ReportComponent: React.FC<ReportProps> = ({ reportId }) => {

    const [embeddedReport, setEmbeddedReport] = useState<Report>();
    const reportDomRef = useRef<HTMLDivElement>(null);
    const loaderDomRef = useRef<HTMLDivElement>(null);

    const [embeddedApiResponse, setEmbeddedApiResponse] = useState<{ embedUrl: string | undefined, accessToken: string | undefined }>({ embedUrl: undefined, accessToken: undefined });
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
        axios.get(`https://localhost:7171/api/Authentication/GetToken/${reportId}`, config)
            .then(({ data }) => {
                setEmbeddedApiResponse({
                    embedUrl: data.EmbedReport[0].EmbedUrl,
                    accessToken: data.EmbedToken.Token
                });
            })
            .catch(error => console.error(error));
    }

    let embedConfiguration = {
        type: 'report',
        id: reportId,
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