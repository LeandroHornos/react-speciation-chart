import React from "react";

export const FlexRowLg10 = (props) => {
  {
    /*Este componente de */
  }
  return (
    <div className={"row" + " " + props.rowClasses}>
      <div className="col-lg-1"></div>
      <div className="col-lg-10">{props.children}</div>
      <div className="col-lg-1"></div>
    </div>
  );
};

export const FlexRow3ColLg = (props) => {
  {
    /*Este componente de */
  }
  return (
    <div className={"row" + " " + props.rowClasses}>
      <div className={"col-lg-" + props.col1 + " " + props.col1Classes}></div>
      <div className={"col-lg-" + props.col2 + " " + props.col2Classes}>
        {props.children}
      </div>
      <div className={"col-lg-" + props.col3 + " " + props.col3Classes}></div>
    </div>
  );
};

export const CenteredColRow = (props) => {
  {
    /*Este componente devuelve una Row de bootstrap, con 3 cols,
    una central que lleva el contenido y dos laterales que hacen de borde.
    centerColSize= número de columnas de ancho de la columna central

    PROPS: 
    breakpoint: "sm" / "md" / "lg", string
    centerColSize: 1 a 12 int, ancho de la columna central de bootrap grid
    rowClasses: string, clases que se agregan al className del div de clase row
    centerColClasses: string, clases que se agregan al className del div de la col central

    ejemplo:
    breakpoint="md" centerColSize={8} centerColClasses="min80 d-flex flex-column justify-content-between align-items-center"
    */
  }
  const { centerColSize, rowClasses, centerColClasses, sideColClasses } = props;
  const bp = props.breakpoint;
  const left = Math.floor((12 - centerColSize) / 2);
  const right = 12 - centerColSize - left;

  return (
    <div className={"row" + " " + rowClasses}>
      <div className={`col-${bp}-${left}` + " " + sideColClasses}></div>
      <div className={`col-${bp}-${centerColSize}` + " " + centerColClasses}>
        {props.children}
      </div>
      <div className={`col-${bp}-${right}` + " " + sideColClasses}></div>
    </div>
  );
};

CenteredColRow.defaultProps = {
  centerColSize: 6,
  breakpoint: "md",
  rowClasses: "",
  centerColClasses: "",
  sideColClasses: "",
};

// LAYOUTS

/* Los siguientes componentes se utilizan para dar estructura general a la web.
Contienen un nav y un footer además del head correspondiente, que carga las 
etiquetas meta así como los links y scripts. 
Cuando se crea el componente de una página, retornar un layout y el contenido
como children */

