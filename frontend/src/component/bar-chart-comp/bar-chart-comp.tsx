import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { BarChartProps } from './bar-chat-comp.interface';
import { BarChartOptions } from './bar-chat-comp.config';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export function BarChartComp({ chartData }: BarChartProps) {
    return <Bar options={BarChartOptions} data={chartData} />;
}