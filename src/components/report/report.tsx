import React, { useEffect, useRef, useState } from 'react';
import { PowerBIEmbed } from 'powerbi-client-react';
import { IReportEmbedConfiguration, Report, models } from 'powerbi-client';
import loaderGif from '../loader/giphy.gif';
import './report.css';
import axios from 'axios';
import { ReportProps } from './reportProps';

const ReportComponent: React.FC<ReportProps> = ({ reportId, basicFilter }) => {
    const [embeddedApiResponse, setEmbeddedApiResponse] = useState<{ embedUrl: string | undefined, accessToken: string | undefined }>({ embedUrl: undefined, accessToken: undefined });
    const [embeddedReport, setEmbeddedReport] = useState<Report>();
    const reportDomRef = useRef<HTMLDivElement>(null);
    const loaderDomRef = useRef<HTMLDivElement>(null);
    const apiUrl = 'https://localhost:7171/api/Authentication/GetToken/';
    useEffect(() => {
        const reportElement = reportDomRef.current;
        if (reportElement) reportElement.style.visibility = 'hidden';

        const loaderElement = loaderDomRef.current;
        if (loaderElement) loaderElement.style.display = 'block';

        getEmbedToken();
    }, []);

    useEffect(() => {
        if (embeddedReport) {
            embeddedReport.on("loaded", () => {
                console.info("Report Loaded");
                callFilter();
                const reportElement = reportDomRef.current;
                const loaderElement = loaderDomRef.current;
                if (reportElement) {
                    reportElement.style.visibility = 'visible';
                }
                if (loaderElement) {
                    loaderElement.style.display = 'none';
                }
            });
            embeddedReport.on("rendered", () => {
                console.info("Report Rendered");
            });
        }
        return () => {
            embeddedReport?.off("loaded");
            embeddedReport?.off("rendered");
        };
    }, [embeddedReport]);

    const callFilter = async () => {
        try {
            await embeddedReport?.updateFilters(models.FiltersOperations.Add, [basicFilter])
        } catch (error) {
            console.log('Error: ', error)
        }
    }

    const getEmbedToken = () => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        };
        axios.get(`${apiUrl}${reportId}`, config)
            .then(({ data }) => {
                setEmbeddedApiResponse({
                    embedUrl: data.EmbedReport[0].EmbedUrl,
                    accessToken: data.EmbedToken.Token
                });
            })
            .catch(error => console.error(error));
    }
    
    let embedConfiguration: IReportEmbedConfiguration = {
        type: 'report',
        id: reportId,
        embedUrl: embeddedApiResponse?.embedUrl,
        accessToken: embeddedApiResponse?.accessToken,
        tokenType: models.TokenType.Embed,
        //filters: [basicFilter],
        settings: {
            visualSettings: {
                visualHeaders: [{
                    settings: { visible: false }
                }]
            },
            panes: {
                filters: {
                    visible: false,
                    expanded: false,
                }
            },
            background: models.BackgroundType.Transparent,
            filterPaneEnabled: false,
            navContentPaneEnabled: false
        }
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