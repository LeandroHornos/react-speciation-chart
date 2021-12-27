import React, { useEffect, useState, useRef } from "react";

import { CSVLink, CSVDownload } from "react-csv";

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

const SpecDiagram = (props) => {
  const { chartContRef } = props;
  const chartRef = useRef();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});

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

  useEffect(() => {
    setLoading(true);
    const { pkas } = props;
    // Calculo los valores a graficar a partir de los pKas dados
    // const { pHvals, Xh2a, Xha, Xa } = diproticSpeciation(pkas);
    const { pHvals, molarfractions } = polyproticSpeciation(pkas);
    const newdata = polyproticChartJsData(pHvals, molarfractions);

    setData(newdata);
    setLoading(false);
  }, [props]);

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
    !loading && (
      <React.Fragment>
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
        <div
          className="d-flex flex-column justify-content-around align-items-center width100"
          style={{ marginTop: "40px" }}
        >
          <button
            className="btn btn-link"
            onClick={(e) => {
              e.preventDefault();
              onClick(e);
            }}
          >
            Descargar la imagen
          </button>
          <CsvDownloader filename={"my-file.csv"} data={data} separator={";"} />
        </div>
      </React.Fragment>
    )
  );
};

export const CsvDownloader = (props) => {
  const pHvals = props.data.labels;
  let dataObject = props.data.datasets;
  dataObject["pH"] = { data: pHvals };
  const keys = Object.keys(props.data.datasets);
  // Creo un array de arrays, donde cada elemento es una fila
  // La primera fila contiene los nombres de los headers
  const dataArray = [keys];

  for (let i = 0; i < pHvals.length; i++) {
    const row = [];
    keys.forEach((key) => {
      row.push(dataObject[key].data[i]);
    });
    dataArray.push(row);
  }

  console.log("header", dataArray[0], "vals", dataArray[1]);

  return (
    <React.Fragment>
      <CSVLink data={dataArray}>Descargar CSV</CSVLink>
    </React.Fragment>
  );
};

export default SpecDiagram;
