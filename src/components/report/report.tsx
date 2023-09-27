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
        if (reportElement) reportElement.style.visibility = 'hidden';

        const loaderElement = loaderDomRef.current;
        if (loaderElement) loaderElement.style.display = 'block';
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

    let embedConfiguration = {
        type: 'report',
        id: 'fadf9640-5c43-4076-8190-9a01e706a032',
        embedUrl: 'https://app.powerbi.com/reportEmbed?reportId=fadf9640-5c43-4076-8190-9a01e706a032&groupId=31dc7868-3fa6-47b7-8bf9-3d4a11d7c140&w=2&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9XQUJJLVVTLU5PUlRILUNFTlRSQUwtRy1QUklNQVJZLXJlZGlyZWN0LmFuYWx5c2lzLndpbmRvd3MubmV0IiwiZW1iZWRGZWF0dXJlcyI6eyJ1c2FnZU1ldHJpY3NWTmV4dCI6dHJ1ZX19',
        accessToken: `H4sIAAAAAAAEACWUx86zWAJE3-XbMhI5jfQvCCabYJJhR7hkfDEZWv3u8033tnRWpVP114-bXQPMyp___mTd0BVcCXs9FIM6FuJBmPi-DmNqLZMIv-m6RWT8FASGioUIorLEF7VZsDPFYS4UJBxeB7PlT0ZlGGcX6TK16tNRzzVM2vchgMvbn0pbSamBsZcVsc_wqN8NQVtdKVG8A0V5V9fA-_K57tkPAZEV4APJzzYkSW9ePNde0vGgSQ8q2uVyUaCbx8-oFTihGEAuFn4KjyBU9Hqntnh5Xzh3t51oumtKR6d0cBKOFMSbE3GqOgqN0trqzIv8mfuvT-d1Ye89wKB40hmQh2MoxYfbtdSe96OWdfUN7W4EnubVaYTogXqD3juANne7Qz0CwQ65loTzO5qF3BZY2MNvd8iDJ-WyvLiruWZbWAnTiZKOBIWJvJBUd0ujqN_dU-EAxbB0nKTG421nRjf5Q3du5eIYBCZeE41faE6qI2HRkR_qilirrfekfAW8G30h3PoSBwmKZooMGio4Q62io2eXA7QbW2eNkPfkZsbZsNFD4GbPsXDgKw3pPkajXiSqTSWalEPD8zBB_YSLkoUqZF5qr2eBXCVnuV7kGN0Bry6NlvhYgaiM9nidsbUjSYKg5KM_GpN3QFXpr7fqbUXx-m6l975tPP3YI2eZD6GOAptovZU2HzrncsitqM1ojZupMW9idgnDmvrLJWR6aeWoYLURLHc5h2FvmiYxEnL3EhDWGMl11uf6JZDuAmzyOTvK8tl8H9K5UBufy4vv58m9uIvvUZumN9UlXE1wlWcDCITnV9yIQ9j1Lrrwy7e4VJieYmxbHwTPA3Xfqntx6A2AdZ8IFEsqaqZ53_7Qe-9xQxFyRIpdmzuP4u2XUS_zrBhBhqr0HonJWSh-w4nL_SwvLpELaoNUEYkr6z9_fv7zI83XtEITXL8zkxIRz8fmHPVFEylVBHRXBvZHk8iVeeyooBWeQHPb48V_cEeTIkJNe4wfThYjaf6laRT79a3BKJBd0irGn-aV1KA89YYhtF3_ILX9AiBjHpq7rGcYs5oJLAOXV3ptldlusUolCo--ibPMahs3uCzIYJRYxjOXuxqDQ6HTDVxveTy-mu0RD-9xclAdfapDhyKi9VnNjytLVnMWsSTo1GyvOtmkgne3DCoWzq5kg4J2U14gFwyMldMe9pfQkELj18-eBSlbR3ckwruZ9nLoES-Mi2Cf5zfiJ4_chSzVnF0VZ5lciYqCRNe8dwh3BDwG-WIYd2k7biy9z4-RX00TfJJgeX68f2u-pgbMevTbcoSlC0jDud3phHQsTqF7Xjv-ofy2_mTrNoNfzJ7RGHs1roYS_mwgK1iXl5qxp_Eq-cgA7OQ9GJ9dew1zu-OD5t2muU6GusrLtqp2TOneY2fAR2rPDHrwnRg-3gp6Id8Ybr49SpdCMwUW2xEekXetIMiuJNhYLScNF25W8TKGEKCbByN14ngrHYAOGY_z9aQyfTx22Jbf7Eeq4S-ztRY0_aQGn4ZtoIkCCoy5rFLaT9ZPsFOTWqhOPru-VTUr5ufON0ssZl1X8OvX76lYCM1UvbaUwWgpuYTMQwV5HOaglyiRoA871GWQc1UkpF5LnoPbI2dIRzIumelXtGXsRoMIDNOi09UwGmFH6Iii-4LRcN-wxOYUeGjv7vZwGOz_nf_7fxnxphlaBgAA.eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9XQUJJLVVTLU5PUlRILUNFTlRSQUwtRy1QUklNQVJZLXJlZGlyZWN0LmFuYWx5c2lzLndpbmRvd3MubmV0IiwiZXhwIjoxNjk1ODI1ODYzLCJhbGxvd0FjY2Vzc092ZXJQdWJsaWNJbnRlcm5ldCI6dHJ1ZX0=`,
        tokenType: models.TokenType.Embed,
        settings: {
            panes: {
                filters: {
                    expanded: false,
                    visible: false
                }
            },
        }
    };

    return (<>

        <div id="container">
        <PowerBIEmbed
                    cssClassName="embed-report"
                    embedConfig={embedConfiguration}
                    getEmbeddedComponent={(embeddedReport) => {
                        setEmbeddedReport(embeddedReport as Report);
                    }}
                />
            {/* <div id="overlay" ref={loaderDomRef}>
                <img id="spinner" alt="Alternate Text" src={loaderGif} />
            </div> */}
            <div ref={reportDomRef}>
                {/* <PowerBIEmbed
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
                /> */}

               
            </div>
        </div>

    </>);
}

export default ReportComponent;