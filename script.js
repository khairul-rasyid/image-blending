const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const blendRange = document.getElementById("blendRange");
const ratio1Label = document.getElementById("ratio1");
const ratio2Label = document.getElementById("ratio2");
const downloadBtn = document.getElementById("downloadBtn");
const resetBtn = document.getElementById("resetBtn");

let image1 = new Image();
let image2 = new Image();
let image1Loaded = false;
let image2Loaded = false;

function loadImage(event, image, callback) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (e) {
    image.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function drawBlendedImage() {
  if (!image1Loaded || !image2Loaded) return;

  canvas.classList.remove("hidden");

  const width = canvas.width;
  const height = canvas.height;
  const ratio = blendRange.value / 100;

  ctx.clearRect(0, 0, width, height);

  const offCanvas1 = document.createElement("canvas");
  offCanvas1.width = width;
  offCanvas1.height = height;
  const offCtx1 = offCanvas1.getContext("2d");
  offCtx1.drawImage(image1, 0, 0, width, height);
  const imageData1 = offCtx1.getImageData(0, 0, width, height);

  const offCanvas2 = document.createElement("canvas");
  offCanvas2.width = width;
  offCanvas2.height = height;
  const offCtx2 = offCanvas2.getContext("2d");
  offCtx2.drawImage(image2, 0, 0, width, height);
  const imageData2 = offCtx2.getImageData(0, 0, width, height);

  const blended = ctx.createImageData(width, height);
  for (let i = 0; i < imageData1.data.length; i += 4) {
    blended.data[i] = imageData1.data[i] * ratio + imageData2.data[i] * (1 - ratio);
    blended.data[i + 1] = imageData1.data[i + 1] * ratio + imageData2.data[i + 1] * (1 - ratio);
    blended.data[i + 2] = imageData1.data[i + 2] * ratio + imageData2.data[i + 2] * (1 - ratio);
    blended.data[i + 3] = 255;
  }

  ctx.putImageData(blended, 0, 0);
}

document.getElementById("image1").addEventListener("change", (e) => {
  image1Loaded = false;
  loadImage(e, image1);
});

document.getElementById("image2").addEventListener("change", (e) => {
  image2Loaded = false;
  loadImage(e, image2);
});

image1.onload = () => {
  image1Loaded = true;
  drawBlendedImage();
};

image2.onload = () => {
  image2Loaded = true;
  drawBlendedImage();
};

blendRange.addEventListener("input", () => {
  const val = blendRange.value;
  ratio1Label.textContent = val;
  ratio2Label.textContent = 100 - val;
  drawBlendedImage();
});

downloadBtn.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "hasil_blending.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
});

resetBtn.addEventListener("click", () => {
  blendRange.value = 50;
  ratio1Label.textContent = 50;
  ratio2Label.textContent = 50;
  drawBlendedImage();
});
