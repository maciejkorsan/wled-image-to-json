import "./App.css";
import React, { useState } from "react";

const arrayToMatrix = (array) => {
  const matrix = [];

  for (let i = 0; i < array.length; i += 16) {
    matrix.push(array.slice(i, i + 16));
  }

  return matrix;
};

const App = () => {
  const [json, setJson] = useState("");
  const [serpentine, setSerpentine] = useState(true);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = event.target.result;
      const image = new Image();
      image.src = data;
      image.addEventListener("load", () => {
        const canvas = document.createElement("canvas");

        const context = canvas.getContext("2d");

        context.drawImage(image, 0, 0);

        const imgArray = [];
        const imageData = context.getImageData(0, 0, image.width, image.height);
        for (let i = 0; i < imageData.data.length; i += 4) {
          const r = imageData.data[i];
          const g = imageData.data[i + 1];
          const b = imageData.data[i + 2];
          imgArray.push(`[${r},${g},${b}]`);
        }

        const imgMatrix = arrayToMatrix(imgArray);

        console.log(imgMatrix);

        let result = `{"seg":{"i":[`;

        const newLength = [];

        for (let i = 0; i < 16; i++) {
          if (serpentine) {
            for (let j = 0; j < 16; j++) {
              newLength.push(imgMatrix[i][j]);
              result += `${imgMatrix[i][j]},`;
            }
          } else {
            if (i % 2 != 0) {
              for (let j = 0; j < 16; j++) {
                result += `${imgMatrix[i][j]},`;
              }
            } else {
              for (let j = 15; j >= 0; j--) {
                result += `${imgMatrix[i][j]},`;
              }
            }
          }
        }
        console.log(newLength);
        result = result.slice(0, -1);
        result += "]}}";
        setJson(result);
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} /> <br />
      <input
        type="checkbox"
        onChange={(e) => setSerpentine(e.target.checked)}
      />{" "}
      Serpentine
      <br />
      <pre>{json}</pre>
    </div>
  );
};

export default App;
