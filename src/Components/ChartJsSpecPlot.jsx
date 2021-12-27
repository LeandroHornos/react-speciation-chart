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

import { polyproticSpeciation, polyproticChartJsData } from "../speciation";

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
    const newdata = polyproticChartJsData(pHvals, molarfractions);

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

export default ChartJsSpecPlot;

// a ver si actualiza con un push
