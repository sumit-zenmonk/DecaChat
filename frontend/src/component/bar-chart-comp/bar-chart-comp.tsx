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
import { faker } from '@faker-js/faker';

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

const labels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const data = {
    labels,
    datasets: [
        {
            label: 'Message Velocity',
            data: labels.map(() => faker.number.int({ min: 0, max: 100 })),
            backgroundColor: ['#A0A3FF', '#C0C1FF'],
        }
    ],
};

export function BarChartComp() {
    return <Bar options={options} data={data} />;
}