import React, { useEffect, useState } from "react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

import { CenteredColRow } from "./Layout";

const ChartJsDemo = () => {
  const { pHvals, Xh2a, Xha, Xa } = diproticSpeciation([3, 8]);

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const [options, setOptions] = useState({});

  useEffect(() => {
    setLoading(true);

    ChartJS.register(
      CategoryScale,
      LinearScale,
      PointElement,
      LineElement,
      Title,
      Tooltip,
      Legend
    );

    const labels = pHvals;

    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Chart.js Line Chart",
        },
      },
    };

    const data = {
      labels,
      datasets: [
        {
          label: "H2A",
          data: Xh2a,
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.5)",
        },
        {
          label: "HA",
          data: Xha,
          borderColor: "rgb(53, 162, 235)",
          backgroundColor: "rgba(53, 162, 235, 0.5)",
        },
        {
          label: "HA",
          data: Xa,
          borderColor: "rgb(53, 32, 235)",
          backgroundColor: "rgba(53, 162, 235, 0.5)",
        },
      ],
    };
    setOptions(options);
    setData(data);
    setLoading(false);
  }, []);
  return (
    <div className="container">
      <header>
        <CenteredColRow
          breakpoint="md"
          centerColSize={8}
          centerColClasses="d-flex flex-column justify-content-between align-items-center"
        >
          <h1>Lean's Speciation Diagram</h1>
        </CenteredColRow>
      </header>
      <main>
        <CenteredColRow
          breakpoint="md"
          centerColSize={8}
          centerColClasses="d-flex flex-column justify-content-between align-items-center"
        >
          <h2>Ejemplo</h2>
          <p>pepito</p>
          {!loading && <Line options={options} data={data} />}
        </CenteredColRow>
      </main>
    </div>
  );
};

const sampleData = {
  pkas: [2.5, 4.6],
  labels: ["1", "2"],
};

export const diproticSpeciation = (pkas) => {
  const pHvals = []; // container para rango de valores de pH (x del grafico)
  const Xh2a = []; // fraccion molar del acido diprotico sin disociar para cada pH
  const Xha = []; // fraccion molar del anion monobasico sin disociar para cada pH
  const Xa = []; // fraccion molar del anion dibasico sin disociar para cada pH

  // Obtengo constantes a partir de pKas
  const k1 = 10 ** (-1 * pkas[0]);
  const k2 = 10 ** (-1 * pkas[1]);

  console.log(pkas, k1, k2);

  // Generar pH vals
  let pH = 0;
  const step = 0.5;
  while (pH <= 14) {
    pHvals.push(pH);
    pH = pH + step;
  }
  for (pH in pHvals) {
    // obtengo conc de protones
    const H = 10 ** (-1 * pH);
    // Calculo fraccion molar de a
    const xa = (k1 * k2) / (k1 * H ** 2 + k1 * H + k1 * k2);
    // Calculo fraccion molar de Ha
    const xha = (k1 * H) / (k1 * H ** 2 + k1 * H + k1 * k2);
    Xa.push(xa);
    Xha.push(xha);
    Xh2a.push(1 - xa - xha);
  }
  console.log({ pHvals, Xh2a, Xha, Xa });
  return { pHvals, Xh2a, Xha, Xa };
};

export default ChartJsDemo;
