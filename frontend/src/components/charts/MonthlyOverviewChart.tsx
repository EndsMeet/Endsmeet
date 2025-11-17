"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function MonthlyOverviewChart({
  income,
  expenses,
}: {
  income: number;
  expenses: number;
}) {
  const net = income - expenses;

  const data = {
    labels: ["Inkomen", "Uitgaven", "Over"],
    datasets: [
      {
        label: "€ per maand",
        data: [income, expenses, net],
        backgroundColor: ["#22c55e", "#ef4444", "#3b82f6"],
      },
    ],
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <Bar data={data} />
    </div>
  );
}