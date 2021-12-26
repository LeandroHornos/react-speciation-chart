import React, { useEffect, useState } from "react";

import { useForm } from "react-hook-form";

import Plot from "react-plotly.js";

import { CenteredColRow } from "./Layout";

const PlotlySpecPlot = () => {
  const { register, handleSubmit } = useForm();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const [options, setOptions] = useState({});
  const [pkas, setPkas] = useState([3, 6]);

  useEffect(() => {
    setLoading(true);
    const data = diproticSpeciation(pkas);
    setData(data);
    setLoading(false);
  }, [pkas]);

  const onSubmit = (data) => {
    console.log(data);
    setPkas([parseFloat(data.pka1), parseFloat(data.pka2)]);
  };
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
          <p>
            Diagrama de especiación de un ácido diprótico. En el gráfico se
            muestra la fracción molar de cada especie para cada pH.
          </p>
          <form onSubmit={handleSubmit(onSubmit)}>
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
                Recalculando
              </button>
            </div>
          </form>
          {!loading && (
            <Plot
              data={[
                {
                  x: data.pHvals,
                  y: data.Xh2a,
                  type: "scatter",
                  mode: "lines",
                  marker: { color: "red" },
                },
                {
                  x: data.pHvals,
                  y: data.Xha,
                  type: "scatter",
                  mode: "lines",
                  marker: { color: "green" },
                },
                {
                  x: data.pHvals,
                  y: data.Xa,
                  label: "Pepito",
                  type: "scatter",
                  mode: "lines",
                  marker: { color: "blue" },
                },
              ]}
              layout={{
                width: "100%",
                height: "50vh",
                title: "Diagrama de especiación",
              }}
            />
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

  console.log("Estos son los pkas recibidos y las constantes", pkas, k1, k2);

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
    console.log({ pH: val, H, xa, xha, xh2a });
  });
  return { pHvals, Xh2a, Xha, Xa };
};

export default PlotlySpecPlot;

// a ver si actualiza con un push
