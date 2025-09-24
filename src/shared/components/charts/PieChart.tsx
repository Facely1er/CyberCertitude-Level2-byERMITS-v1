import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export interface PieChartData {
  name: string;
  value: number;
  color?: string;
}

export interface PieChartProps {
  labels: string[];
  data: number[];
  backgroundColor?: string[];
  className?: string;
  title?: string;
}

export const PieChart: React.FC<PieChartProps> = ({
  labels,
  data,
  backgroundColor = [
    'rgba(59, 130, 246, 0.8)',
    'rgba(239, 68, 68, 0.8)',
    'rgba(16, 185, 129, 0.8)',
    'rgba(245, 158, 11, 0.8)',
    'rgba(139, 92, 246, 0.8)',
    'rgba(236, 72, 153, 0.8)',
    'rgba(6, 182, 212, 0.8)',
    'rgba(132, 204, 22, 0.8)',
    'rgba(249, 115, 22, 0.8)',
    'rgba(99, 102, 241, 0.8)'
  ],
  className = '',
  title
}) => {
  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor,
        borderColor: backgroundColor.map(color => color.replace('0.8', '1')),
        borderWidth: 2,
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: 'rgb(107, 114, 128)',
          font: {
            size: 12,
            weight: '500' as const,
          },
          padding: 20,
          usePointStyle: true,
        },
      },
      title: {
        display: !!title,
        text: title,
        color: 'rgb(75, 85, 99)',
        font: {
          size: 16,
          weight: '600' as const,
        },
        padding: {
          top: 10,
          bottom: 30,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleColor: 'rgb(243, 244, 246)',
        bodyColor: 'rgb(243, 244, 246)',
        borderColor: 'rgba(75, 85, 99, 0.3)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context: any) {
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ${context.parsed} (${percentage}%)`;
          }
        }
      },
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart' as const,
    },
  };

  return (
    <div className={`relative ${className}`} style={{ height: '300px' }}>
      <Pie data={chartData} options={options} />
    </div>
  );
};