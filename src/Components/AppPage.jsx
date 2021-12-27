import React, { useState, useRef } from "react";

// REACT-HOOK-FORM
import { useForm } from "react-hook-form";

import { CenteredColRow } from "./Layout";

import SpecDiagram from "./SpecDiagram";

const AppPage = () => {
  const chartContRef = useRef(null);
  const { register, handleSubmit, reset } = useForm({});
  const [protons, setProtons] = useState(new Array(1).fill(1));
  const [pkas, setPkas] = useState([6]);
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
    chartContRef.current.scrollIntoView();
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
          <SpecDiagram pkas={pkas} chartContRef={chartContRef} />
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

export default AppPage;

// a ver si actualiza con un push
