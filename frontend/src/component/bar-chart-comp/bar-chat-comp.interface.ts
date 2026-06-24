export interface BarChartProps {
    chartData: {
        labels: string[];
        datasets:
        {
            label: string;
            data: number[];
            backgroundColor: string[];
        } [];
    }
}