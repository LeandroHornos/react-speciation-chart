import React, { useEffect, useState, useRef } from "react";

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
        <button
          className="btn btn-link"
          onClick={(e) => {
            e.preventDefault();
            onClick(e);
          }}
        >
          Descargar la imagen
        </button>
      </React.Fragment>
    )
  );
};

export default SpecDiagram;

// a ver si actualiza con un push
