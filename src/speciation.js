/* 

CALCULOS PARA EL DIAGRAMA DE ESPECIACION
........................................

Estas funciones, dado un conjunto de pkas, calculan las fracciones
molares de cada especie para cada punto en la escala de pH. 

Se da como ejemplo particular la especiacion de un ácido diprótico
y luego se extiende a la fórmula general de un ácido poliprótico.

Para un ácido poliprótico definido genericamente como HNA, donde N es el
número de protones capaces de ser intercambiados, si se conocen
sus constantes de disociación puede calcularse la fracción molar
de cada una de las especies con distinto grado de disociación para cada pH.

Llamemos P al polinomio definido como

P = [H+]^N + K1*[H+]^(N-1) + K1*K2*[H+]^(N-2) + ... + K1*K2*...*KN*[H+]^(N-N = 0)

y Llamamos Tk a cada término del polinomio, de forma tal que

P = T0 + T1 + T2 + ... + TN

Vemos que el polinomio tiene N+1 términos, es decir, hay un término en el
polinomio por cada especie en el equilibrio. 

Si se trabaja con los balances de masa y las ecuaciones de equilibrio puede
llegarse a la siguiente expresión:

--------------------------------------
|                                     |
|   XHkA = TN-k / P ; k=0,1,2,...,N   |
|                                     |
---------------------------------------

Es decir, la fracción molar de la especie que tiene k protones a un dado pH
es igual un término del poliniomio dividido el polinomio completo.

En esta ecuación se basa el cálculo de las fracciones molares que se hace a 
continuación

*/

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

  // Crear un objeto para almacenar las fracciones molares calculadas
  let data = {};

  // Como keys uso el número de hidrógenos de la especie en cuestión
  // que va desde 0 hasta N
  for (let i = 0; i <= N; i++) {
    const key = () => {
      if (i === 0) return "A";
      else if (i === 1) return "HA";
      else return `H${i}A`;
    };
    data[i.toString()] = { name: key(), points: [], Hs: i };
  }

  // Obtengo los pkas de menor mayor
  pkas = pkas.sort(function (a, b) {
    return a - b;
  });
  // Calculo las constantes a partir de los pKas
  const ks = pkas.map((pka) => {
    return 10 ** (-1 * pka);
  });
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

  const datasets = Object.keys(molarfractions).map((key, index) => {
    // Indice para el color. Tomo secuencialmente los 10 primeros
    // colores, si se necesitan más uso un color al azar
    const randomColor = randomRgb();
    return {
      label: molarfractions[key].name,
      data: molarfractions[key].points,
      backgroundColor: index < 10 ? colorList[index] : randomColor,
      borderColor: index < 10 ? colorList[index] : randomColor,
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

const colorList = [
  "rgb(255,50,50)",
  "rgb(50,255,50)",
  "rgb(50,50,255)",
  "rgb(252,186,3)",
  "rgb(219,3,252)",
  "rgb(66,174,189)",
  "rgb(227,107,16)",
  "rgb(102,189,106)",
  "rgb(88,12,138)",
  "rgb(112,103,117)",
  "rgb(122,143,86)",
];
