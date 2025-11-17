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

export default function FreeToPlayChart({ freeToPlay }: { freeToPlay: number }) {
  const data = {
    labels: ["Vrij te spelen per maand"],
    datasets: [
      {
        label: "€",
        data: [freeToPlay],
        backgroundColor: ["#22c55e"],
      },
    ],
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <Bar data={data} />
    </div>
  );
}