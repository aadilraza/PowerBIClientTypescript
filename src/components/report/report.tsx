import React, { useEffect, useRef, useState } from 'react';
import { PowerBIEmbed } from 'powerbi-client-react';
import { IReportEmbedConfiguration, Report, models } from 'powerbi-client';
import loaderGif from '../loader/giphy.gif';
import './report.css';
import axios from 'axios';
import { ReportProps } from './reportProps';

const ReportComponent: React.FC<ReportProps> = ({ reportId, filter }) => {
    const [embeddedApiResponse, setEmbeddedApiResponse] = useState<{ embedUrl: string | undefined, accessToken: string | undefined }>({ embedUrl: undefined, accessToken: undefined });
    const [embeddedReport, setEmbeddedReport] = useState<Report>();
    const reportDomRef = useRef<HTMLDivElement>(null);
    const loaderDomRef = useRef<HTMLDivElement>(null);
    const locallyDeployedApi = 'http://localhost:86';
    const apiUrl = `${locallyDeployedApi}/api/Authentication/GetToken/`;
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
                getVisuals();
                callVisualFilter();
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

    const callVisualFilter = async () => {
        // Retrieve the page collection and get the visuals for the active page.
        try {
            const pages = await embeddedReport?.getPages();
            // Retrieve the active page.
            if (pages) {
                const page = pages.filter(function (page) {
                    return page.isActive
                })[0];
                const visuals = await page.getVisuals();
                // Retrieve the target visual.
                const multiRowCardVisuals = visuals.filter(x => x.type === "multiRowCard");
                for (const visual of multiRowCardVisuals) {
                    // Add the filter to the visual's filters.
                    await visual.updateFilters(models.FiltersOperations.Add, [filter]);
                }
            }
        }
        catch (errors) {
            console.log(errors);
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

    const getVisuals = async () => {
        // Retrieve the page collection and get the visuals for the active page.
        try {
            const pages = await embeddedReport?.getPages();
            if (pages) {
                let page = pages.filter(function (page) {
                    return page.isActive
                })[0];

                const visuals = await page.getVisuals();
                console.log(
                    visuals.map(function (visual) {
                        return {
                            name: visual.name,
                            type: visual.type,
                            title: visual.title,
                            layout: visual.layout
                        };
                    }));
            }
        }
        catch (errors) {
            console.log(errors);
        }
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