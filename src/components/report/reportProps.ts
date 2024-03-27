import { models } from "powerbi-client";

export interface ReportProps {
    reportName: string;
    filter?: models.IBasicFilter;
    className : string;
}