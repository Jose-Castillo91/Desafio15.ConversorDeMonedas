document.getElementById("convert").addEventListener("click", async function () {
  const amount = document.getElementById("amount").value;
  const currency = document.getElementById("currency").value;
  const resultElement = document.getElementById("result");

  if (!amount || amount <= 0) {
    resultElement.innerHTML = "Por favor, ingrese un monto válido.";
    return;
  }

  try {
    const response = await fetch("https://mindicador.cl/api");
    if (!response.ok) throw new Error("No se pudo obtener los datos.");

    const data = await response.json();
    const exchangeRate = data[currency].valor;
    const convertedAmount = (amount / exchangeRate).toFixed(2);

    resultElement.innerHTML = `Monto en ${currency.toUpperCase()}: ${convertedAmount}`;

    obtenerHistorial(currency);
  } catch (error) {
    resultElement.innerHTML = "Error al obtener la información.";
  }
});

async function obtenerHistorial(currency) {
  try {
    const response = await fetch(`https://mindicador.cl/api/${currency}`);
    if (!response.ok) throw new Error("No se pudo obtener los datos.");

    const data = await response.json();
    const ultimos10Dias = data.serie.slice(0, 10).reverse();

    const fechas = ultimos10Dias.map((entry) =>
      new Date(entry.fecha).toLocaleDateString()
    );
    const valores = ultimos10Dias.map((entry) => entry.valor);

    generarGrafico(fechas, valores);
  } catch (error) {
    console.log("Error al obtener historial:", error);
  }
}

let chartInstance = null;

function generarGrafico(labels, data) {
  const canvas = document.getElementById("chart");
  const ctx = canvas.getContext("2d");

  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Historial últimos 10 días",
          data: data,
          borderColor: "blue",
          borderWidth: 2,
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });
}
