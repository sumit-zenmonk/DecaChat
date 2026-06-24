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

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top' as const,
            display: false,
        },
        title: {
            display: false,
            text: 'Chart.js Bar Chart',
        },
        tooltip: {
            enabled: true,
        },
        scales: {
            y: {
                ticks: {
                    display: false,
                },
                grid: {
                    display: false,
                }
            },
            x: {
                grid: {
                    display: false,
                }
            }
        }
    },
};

interface BarChartProps {
    data: any;
}

export function BarChartComp({ data }: BarChartProps) {
    return <Bar options={options} data={data} />;
}