import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export default function RadarPerfil({ data }) {
  const chartData = {
    labels: [
      "Realista",
      "Investigativo",
      "Artístico",
      "Social",
      "Emprendedor",
      "Convencional"
    ],
    datasets: [
      {
        label: "Perfil",
        data: [
          data.R,
          data.I,
          data.A,
          data.S,
          data.E,
          data.C,
        ],
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        borderColor: "rgb(59, 130, 246)",
        borderWidth: 2,
        pointBackgroundColor: "rgb(59, 130, 246)",
        pointBorderColor: "#fff",
        pointHoverRadius: 6,
        pointRadius: 4,
      },
    ],
  };

  const options = {
  responsive: true,
  animation: {
    duration: 1200,
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          return `${context.raw}%`;
        },
      },
    },
  },
  scales: {
    r: {
      min: 0,
      max: 100,

      ticks: {
        display: true,
        stepSize: 25,
        backdropColor: "transparent",
        color: "rgba(0,0,0,0.4)",
        z: 1,
        callback: (value) => value + "%"
      },

      grid: {
        color: "rgba(0,0,0,0.1)",
      },

      angleLines: {
        color: "rgba(0,0,0,0.1)",
      },

      pointLabels: {
        font: {
          size: 15,
          weight: "400"
        },
        color: "rgb(21, 128, 168)",
      },
    },
  },
};

  return <Radar data={chartData} options={options} />;
}