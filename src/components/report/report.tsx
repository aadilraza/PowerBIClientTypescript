import React, { useEffect, useRef, useState } from 'react';
import { PowerBIEmbed } from 'powerbi-client-react';
import { IReportEmbedConfiguration, Report, models } from 'powerbi-client';
import loaderGif from '../loader/giphy.gif';
import './report.css';
import axios from 'axios';
import { ReportProps } from './reportProps';
 type ReportDetail = {
    embedUrl: string | undefined;
    accessToken: string | undefined;
    reportId : string | undefined;
}

const ReportComponent: React.FC<ReportProps> = ({ filter,reportName }) => {
    const [embeddedApiResponse, setEmbeddedApiResponse] = useState<ReportDetail>({ embedUrl: undefined, accessToken: undefined, reportId: undefined });
    const [embeddedReport, setEmbeddedReport] = useState<Report>();
    const reportDomRef = useRef<HTMLDivElement>(null);
    const loaderDomRef = useRef<HTMLDivElement>(null);
    const locallyDeployedApi = 'https://qa-evm4-b.irsavideo.com/api/v1/PbiEmbed/Token/Report';
    const apiUrl = `${locallyDeployedApi}/${reportName}/1a1a5390-0963-4465-8db0-1fdcf8a3a218`;
    useEffect(() => {
        const reportElement = reportDomRef.current;
        if (reportElement) reportElement.style.visibility = 'hidden';
        getEmbedToken();
    }, []);


    useEffect(() => {
        if (embeddedReport) {
            embeddedReport.on("loaded", () => {
                if (filter) {
                    callVisualFilter(filter);
                }
                const reportElement = reportDomRef.current;
                if (reportElement)
                    reportElement.style.visibility = 'visible';
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

    const callVisualFilter = async (_filter: models.IBasicFilter) => {
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
                    await visual.updateFilters(models.FiltersOperations.Add, [_filter]);
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
        axios.get(`${apiUrl}`, config)
            .then(({ data }) => {
                setEmbeddedApiResponse({
                    embedUrl: data.EmbedReport[0].EmbedUrl,
                    accessToken: data.EmbedToken.Token,
                    reportId: data.EmbedReport[0].ReportId
                });
            })
            .catch(error => console.error(error));
    }

    let embedConfiguration: IReportEmbedConfiguration = {
        type: 'report',
        id: embeddedApiResponse.reportId,
        embedUrl: embeddedApiResponse?.embedUrl,
        accessToken: embeddedApiResponse?.accessToken,
        tokenType: models.TokenType.Embed,
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
            {/* <div id="overlay" ref={loaderDomRef}>
                <img id="spinner" alt="Alternate Text" src={loaderGif} />
            </div> */}
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