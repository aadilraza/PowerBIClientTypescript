import { models } from "powerbi-client";

export interface ReportProps {
    reportId: string;
    basicFilter: models.IBasicFilter;
}