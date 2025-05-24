let model;

window.onload = async () => {
  model = await cocoSsd.load();
  console.log("Modelo COCO-SSD carregado.");
};

document.getElementById("imageUpload").addEventListener("change", handleImageUpload);

async function handleImageUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const img = new Image();
  img.src = URL.createObjectURL(file);
  img.onload = async () => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = img.width;
    canvas.height = img.height;

    ctx.drawImage(img, 0, 0);

    const predictions = await model.detect(canvas);
    console.log("Predições:", predictions);

    drawPredictions(predictions, ctx);
    showResults(predictions);
  };
}

function drawPredictions(predictions, ctx) {
  ctx.lineWidth = 2;
  ctx.font = "18px Arial";

  predictions.forEach(pred => {
    const [x, y, width, height] = pred.bbox;

    ctx.strokeStyle = "#ffc600";
    ctx.strokeRect(x, y, width, height);

    ctx.fillStyle = "#ffc600";
    ctx.fillText(`${pred.class} (${(pred.score * 100).toFixed(1)}%)`, x, y > 10 ? y - 5 : 10);
  });
}

function showResults(predictions) {
  const resultDiv = document.getElementById("result");
  if (predictions.length === 0) {
    resultDiv.innerHTML = "<p>Nenhum objeto detectado.</p>";
    return;
  }

  resultDiv.innerHTML = "<h2>Objetos Detectados:</h2><ol>" +
    predictions.map(p => `<li>${p.class} - ${(p.score * 100).toFixed(2)}%</li>`).join("") +
    "</ol>";
}
