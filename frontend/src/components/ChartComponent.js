import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ChartComponent = ({ ventesParMois, annee }) => {
  const moisLabels = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];

  const data = {
    labels: moisLabels,
    datasets: [
      {
        label: `Commandes validées en ${annee}`,
        data: moisLabels.map((_, i) => ventesParMois?.[i] || 0),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: `Statistiques de ventes (${annee})`,
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default ChartComponent;
