import React, { useEffect, useState } from "react";

// REACT-HOOK-FORM
import { useForm } from "react-hook-form";

// CHART.JS
import {
  Chart as ChartJS,
  CategoryScale,
  PointElement,
  LinearScale,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// REACT-CHARTJS-2
import { Line } from "react-chartjs-2";

import { CenteredColRow } from "./Layout";

const ChartJsSpecPlot = () => {
  const { register, handleSubmit } = useForm({
    defaultValues: { pka1: 4, pka2: 8 },
  });

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const [pkas, setPkas] = useState([4, 8]);

  //Chart Options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          callback: function (value, index, values) {
            return value / 10;
          },
        },
      },
      y: {
        ticks: {
          callback: function (value, index, values) {
            return value;
          },
        },
      },
    },
    elements: {
      point: {
        radius: 0,
      },
    },
    plugins: {
      colorschemes: {
        scheme: "brewer.Paired12",
      },
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Diagrama de Especiación",
        font: {
          size: 20,
        },
      },
    },
  };

  useEffect(() => {
    setLoading(true);
    // Calculo los valores a graficar a partir de los pKas dados
    // const { pHvals, Xh2a, Xha, Xa } = diproticSpeciation(pkas);
    const { pHvals, molarfractions } = polyproticSpeciation(pkas);
    const newdata = polyproticChartData(pHvals, molarfractions);

    // Creo el gráfico en ChartJS
    ChartJS.register(
      CategoryScale,
      LinearScale,
      PointElement,
      LineElement,
      Title,
      Tooltip,
      Legend
    );
    setData(newdata);
    setLoading(false);
  }, [pkas]);

  const onSubmit = (data) => {
    setPkas([parseFloat(data.pka1), parseFloat(data.pka2)]);
  };
  return (
    <div className="container">
      <header>
        <CenteredColRow
          rowClasses=" width100"
          breakpoint="md"
          centerColSize={10}
          centerColClasses="d-flex flex-column justify-content-between align-items-center"
        >
          <h1 className="text-center">Lean's Speciation Diagram</h1>
        </CenteredColRow>
      </header>
      <main>
        <CenteredColRow
          rowClasses="width100"
          breakpoint="md"
          centerColSize={10}
          centerColClasses="d-flex flex-column justify-content-between align-items-center"
        >
          <h3 className="text-center">Demo</h3>
          <p>
            Diagrama de especiación de un ácido diprótico. En el gráfico se
            muestra la fracción molar de cada especie para cada pH.
            <br />
            Usa los siguientes campos para experimentar como varía el gráfico
            con distintos valores de pKa. <br />
            Puedes guardar el gráfico como archivo de imagen haciendo click
            derecho y seleccionando del menú "guardar imagen como"
          </p>
          <div className="d-flex justify-content-start align-items-left width100">
            <form
              onSubmit={handleSubmit(onSubmit)}
              style={{ marginBottom: "60px" }}
            >
              <div className="form-group">
                <label htmlFor="pka1">pKa1</label>
                <input
                  className="form-control"
                  type="number"
                  step="0.01"
                  {...register("pka1")}
                />
              </div>
              <div className="form-group">
                <label htmlFor="pka2">pKa2</label>
                <input
                  className="form-control"
                  type="number"
                  step="0.01"
                  {...register("pka2")}
                />
              </div>
              <div className="form-group">
                <button type="submit" className="btn btn-primary">
                  Recalcular
                </button>
              </div>
            </form>
          </div>
          {!loading && (
            <div
              style={{ width: "100%", maxHeight: "100vh", minHeight: "50vh" }}
            >
              <Line options={options} data={data} />
            </div>
          )}
        </CenteredColRow>
      </main>
    </div>
  );
};

export const diproticSpeciation = (pkas) => {
  const pHvals = []; // container para rango de valores de pH (x del grafico)
  const Xh2a = []; // fraccion molar del acido diprotico sin disociar para cada pH
  const Xha = []; // fraccion molar del anion monobasico sin disociar para cada pH
  const Xa = []; // fraccion molar del anion dibasico sin disociar para cada pH

  // Obtengo constantes a partir de pKas
  const k1 = 10 ** (-1 * pkas[0]);
  const k2 = 10 ** (-1 * pkas[1]);

  // Generar pH vals
  let pH = 0;
  const step = 0.1;
  while (pH <= 14) {
    pHvals.push(pH);
    pH = pH + step;
  }
  pHvals.forEach((val) => {
    // obtengo conc de protones
    const H = 10 ** (-1 * val);
    // Calculo fraccion molar de a
    const xa = (k1 * k2) / (H ** 2 + k1 * H + k1 * k2);
    // Calculo fraccion molar de Ha
    const xha = (k1 * H) / (H ** 2 + k1 * H + k1 * k2);
    // Calculo fraccion molar de H2a
    const xh2a = H ** 2 / (H ** 2 + k1 * H + k1 * k2);
    Xa.push(xa);
    Xha.push(xha);
    Xh2a.push(xh2a);
  });
  return { pHvals, Xh2a, Xha, Xa };
};

export const polyproticSpeciation = (pkas) => {
  console.log("Poly dice Hola!");
  const N = pkas.length; // El número de equilibrios

  // Genero los puntos de X (pH) para el gráfico
  const pHvals = [];
  let pH = 0;
  const step = 0.1;
  while (pH <= 14) {
    pHvals.push(pH);
    pH = pH + step;
  }

  // Estructura para almacenar los valores de y de cada serie
  let data = {};
  // Crear un objeto para almacenar las fracciones molares calculadas
  for (let i = 0; i <= N; i++) {
    const key = () => {
      if (i == 0) return "A";
      else if (i == 1) return "HA";
      else return `H${i}A`;
    };
    data[i.toString()] = { name: key(), points: [], Hs: i };
  }

  // Obtengo las constantes
  const ks = pkas.map((pka) => {
    return 10 ** (-1 * pka);
  });
  console.log("ks", ks);

  // Obtengo los coeficionentes del polinomio
  const coefs = [1];
  let coef = 1;
  ks.forEach((k) => {
    coef = k * coef;
    coefs.push(coef);
  });

  // Calculo las fracciones molares correspondientes a cada pH:
  pHvals.forEach((val) => {
    const pterms = []; // Los términos del polinomio
    const H = 10 ** (-1 * val); // Concentracion de protones

    // Obtengo el valor de cada término del polinomio
    for (let i = 0; i < coefs.length; i++) {
      pterms.push(coefs[i] * H ** (N - i));
    }
    // Obtengo la suma de los términos del polinomio
    const psum = pterms.reduce((a, b) => a + b, 0);

    // Calculo el valor de cada fracción molar:
    for (let i = 0; i <= N; i++) {
      data[i.toString()]["points"].push(pterms[N - i] / psum);
    }
  });
  console.log("data procesada", data);
  return { pHvals, molarfractions: data };
};

export const polyproticChartData = (pHvals, molarfractions) => {
  // para cada key en data hay que obtener la serie
  // en el grafico

  const datasets = Object.keys(molarfractions).map((key) => {
    let color = randomRgb()
    return {
      label: molarfractions[key].name,
      data: molarfractions[key].points,
      backgroundColor: color ,
      borderColor: color,
    };
  });
  const newdata = {
    labels: pHvals,
    datasets,
  };
  return newdata;
};

const randomRgb = () => {
  let i = 0;
  let vals = [];
  while (i < 3) {
    vals.push(Math.floor(Math.random() * 255));
    i++;
  }
  return `rgb(${vals[0]},${vals[1]},${vals[2]})`;
};

export default ChartJsSpecPlot;

// a ver si actualiza con un push
