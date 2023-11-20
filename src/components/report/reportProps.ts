import { models } from "powerbi-client";

export interface ReportProps {
    reportId: string;
    filter: models.IBasicFilter;
}