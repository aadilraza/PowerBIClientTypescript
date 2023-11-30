import React, { useEffect, useRef, useState } from 'react';
import { PowerBIEmbed } from 'powerbi-client-react';
import { Dashboard, IDashboardEmbedConfiguration, IReportEmbedConfiguration, Report, models } from 'powerbi-client';
import loaderGif from '../loader/giphy.gif';
import './dashboard.css';
import axios from 'axios';
import { DashboardProps } from './dashboardProps';

const DashboardComponent: React.FC<DashboardProps> = ({ dashboardId }) => {
    const [embeddedApiResponse, setEmbeddedApiResponse] = useState<{ embedUrl: string | undefined, accessToken: string | undefined }>({ embedUrl: undefined, accessToken: undefined });
    const [embeddedDashboard, setEmbeddedDashboord] = useState<Dashboard>();
    const reportDomRef = useRef<HTMLDivElement>(null);
    const loaderDomRef = useRef<HTMLDivElement>(null);
    const locallyDeployedApi = 'http://localhost:86';
    const apiUrl = `${locallyDeployedApi}/api/Authentication/GetToken/Dashboard/`;
    useEffect(() => {
        const dashboardElement = reportDomRef.current;
        if (dashboardElement) dashboardElement.style.visibility = 'hidden';

        const loaderElement = loaderDomRef.current;
        if (loaderElement) loaderElement.style.display = 'block';

        getEmbedToken();
    }, []);

    useEffect(() => {
        if (embeddedDashboard) {
            embeddedDashboard.on("loaded", () => {
                console.info("Report Loaded");
                const dashboardElement = reportDomRef.current;
                const loaderElement = loaderDomRef.current;
                if (dashboardElement) {
                    dashboardElement.style.visibility = 'visible';
                }
                if (loaderElement) {
                    loaderElement.style.display = 'none';
                }
            });
            embeddedDashboard.on("rendered", () => {
                console.info("Report Rendered");
            });
        }
        return () => {
            embeddedDashboard?.off("loaded");
            embeddedDashboard?.off("rendered");
        };
    }, [embeddedDashboard]);

    const getEmbedToken = () => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        };
        axios.get(`${apiUrl}${dashboardId}`, config)
            .then(({ data }) => {
                setEmbeddedApiResponse({
                    embedUrl: data.EmbedDashboard[0].EmbedUrl,
                    accessToken: data.EmbedToken.Token
                });
            })
            .catch(error => console.error(error));
    }

    let embedConfiguration: IDashboardEmbedConfiguration = {
        type: 'dashboard',
        id: dashboardId,
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
            <div id="overlay" ref={loaderDomRef}>
                <img id="spinner" alt="Alternate Text" src={loaderGif} />
            </div>
            <div ref={reportDomRef}>
                <PowerBIEmbed
                    cssClassName="embed-dashboard"
                    embedConfig={embedConfiguration}
                    getEmbeddedComponent={(embeddedDashboard) => {
                        setEmbeddedDashboord(embeddedDashboard as Dashboard);
                    }}
                />
            </div>
        </div>
    );
}

export default DashboardComponent;