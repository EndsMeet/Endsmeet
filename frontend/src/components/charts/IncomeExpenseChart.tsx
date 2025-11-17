"use client";

import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function IncomeExpenseChart({
  income,
  expenses,
}: {
  income: number;
  expenses: number;
}) {
  const data = {
    labels: ["Inkomen", "Uitgaven"],
    datasets: [
      {
        data: [income, expenses],
        backgroundColor: ["#22c55e", "#ef4444"], // groen / rood
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="w-full max-w-xs mx-auto">
      <Doughnut data={data} />
    </div>
  );
}