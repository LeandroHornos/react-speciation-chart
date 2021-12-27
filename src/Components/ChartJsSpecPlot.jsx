import React, { useEffect, useState, useRef } from "react";

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
  const chartContRef = useRef(null);
  const chartRef = useRef();
  const { register, handleSubmit, reset } = useForm({});
  const [protons, setProtons] = useState(new Array(1).fill(1));
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const [pkas, setPkas] = useState([4]);

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

  const handleProtonsChange = (n) => {
    const array = new Array(parseInt(n)).fill(1);
    reset();
    setProtons(array);
    return;
  };

  const onSubmit = (data) => {
    const keys = Object.keys(data);
    const newPkas = [];
    keys.forEach((key) => {
      newPkas.push(data[key]);
    });
    setPkas(newPkas);
    chartRef.current.scrollIntoView();
  };

  const onClick = (event) => {
    /* Esta funcion toma una captura
    del estado actual del gráfico y dispara
    la descarga del archivo png */
    downloadChartImg(chartRef.current.toBase64Image());
  };

  const downloadChartImg = (url) => {
    const link = document.createElement("a");
    link.download = "filename.png";
    link.href = url;
    link.click();
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
            Diagrama de especiación de un ácido poliprótico. En el gráfico se
            muestra la fracción molar de cada especie para cada pH.
            <br />
            Selecciona el número de protones y usa los campos generados para
            experimentar como varía el gráfico con distintos valores de pKa.{" "}
            <br />
            Puedes guardar el gráfico como archivo de imagen haciendo click
            derecho y seleccionando del menú "guardar imagen como"
          </p>
          <div
            className="width100 d-flex align-items-left justify-content-start"
            style={{ margin: "10px 0px" }}
          >
            <div className="formGroup">
              <label htmlFor="protons">
                <strong>Número de protones</strong>
              </label>
              <select
                className="form-control"
                name="protons"
                id="protons"
                defaultValue={1}
                onChange={(e) => {
                  handleProtonsChange(e.target.value);
                }}
              >
                {new Array(10).fill(1).map((number, i) => {
                  i = parseInt(i) + 1;
                  return (
                    <option value={i} key={"opt" + i.toString()}>
                      {i}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          <div className="d-flex justify-content-start align-items-left width100">
            <form
              onSubmit={handleSubmit(onSubmit)}
              style={{ marginBottom: "60px" }}
            >
              <h3 className="text-left">Pkas</h3>
              {protons.map((v, i) => {
                return (
                  <div className="form-group" key={`pka${i + 1}`}>
                    <label htmlFor={`pka${i + 1}`}>{`pka${i + 1}`}</label>
                    <input
                      className="form-control"
                      type="number"
                      step="0.01"
                      {...register(`pka${i + 1}`, { required: true })}
                    />
                  </div>
                );
              })}

              <div className="form-group">
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ marginTop: "20px" }}
                >
                  Recalcular
                </button>
              </div>
            </form>
          </div>
          {!loading && (
            <React.Fragment>
              {" "}
              <div
                ref={chartContRef}
                style={{ width: "100%", maxHeight: "100vh", minHeight: "50vh" }}
              >
                <Line
                  options={options}
                  data={data}
                  ref={chartRef}
                  onClick={onClick}
                />
              </div>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onClick(e);
                }}
              >
                Descargar la imagen
              </a>
            </React.Fragment>
          )}
        </CenteredColRow>
      </main>
      <footer style={{ marginTop: "60px", marginBottom: "10px" }}>
        <CenteredColRow
          centerColSize={12}
          centerColClasses="d-flex align-items-center justify-content-center"
        >
          <a
            href="https://github.com/LeandroHornos"
            style={{ fontSize: "0.6em" }}
          >
            https://github.com/LeandroHornos
          </a>
        </CenteredColRow>
      </footer>
    </div>
  );
};

export default ChartJsSpecPlot;

// a ver si actualiza con un push
