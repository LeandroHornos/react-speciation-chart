

/* 

CALCULOS PARA EL DIAGRAMA DE ESPECIACION
........................................

Estas funciones, dado un conjunto de pkas, calculan las fracciones
molares de cada especie para cada punto en la escala de pH. 

Se da como ejemplo particular la especiacion de un ácido diprótico
y luego se extiende a la fórmula general de un ácido poliprótico



*/ export const diproticSpeciation = (pkas) => {
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

export const polyproticChartJsData = (pHvals, molarfractions) => {
  // para cada key en data hay que obtener la serie
  // en el grafico

  const datasets = Object.keys(molarfractions).map((key) => {
    let color = randomRgb();
    return {
      label: molarfractions[key].name,
      data: molarfractions[key].points,
      backgroundColor: color,
      borderColor: color,
    };
  });
  const newdata = {
    labels: pHvals,
    datasets,
  };
  return newdata;
};

export const randomRgb = () => {
  let i = 0;
  let vals = [];
  while (i < 3) {
    vals.push(Math.floor(Math.random() * 255));
    i++;
  }
  return `rgb(${vals[0]},${vals[1]},${vals[2]})`;
};
