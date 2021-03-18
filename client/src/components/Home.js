import React, { useState, useEffect, useRef } from "react";
import GetDifference from'../ImageDiff'
import image from "../images/human-hand-front.jpg";
import axios from 'axios'


export const Home = () => {
  const [isDrawing, setIsDrawing] = useState(true);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [name, setName]= useState('Hand')
  const [drawingData, setDrawingData] = useState()

  const [drawing, setDrawing] = useState([]);
  const [photo, setPhoto] = useState([]);
  const draw = (e) => {
    if (isDrawing === true) {
      drawLine(
        gridContext,
        x,
        y,
        e.clientX - e.target.offsetLeft,
        e.clientY - e.target.offsetTop
      );
      setX(e.clientX - e.target.offsetLeft);
      setY(e.clientY - e.target.offsetTop);
    }
  };

  const endLine = (e) => {
    if (isDrawing === true) {
      setIsDrawing(false);
    } else {
      setIsDrawing(true);

      setX(e.clientX - e.target.offsetLeft);
      setY(e.clientY - e.target.offsetTop);
    }
  };

  const [loaded, setLoaded] = useState(false);

  const imgRef = useRef(null);

  const imageElement = () => (
    <img
      className="photo"
      id="hand"
      style={loaded ? {} : { display: "none" }}
      src={image}
      ref={imgRef}
      onLoad={() => setLoaded(true)}
    />
  );

  const drawLine = (gridContext, x1, y1, x2, y2) => {
    if (isDrawing === true && loaded) {
      gridContext.current.beginPath();
      gridContext.current.strokeStyle = "black";
      gridContext.current.lineWidth = 1;
      gridContext.current.moveTo(x1, y1);
      gridContext.current.lineTo(x2, y2);
      gridContext.current.stroke();
      gridContext.current.closePath();
      setDrawing(
        gridContext.current.getImageData(0, 0, grid.width, grid.height)
      );
    }
  };

  const canvasRef = useRef(null);
  const canvasContext = useRef(null);
  const gridRef = useRef(null);
  const gridContext = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvasContext.current = canvas.getContext("2d");
    if (loaded) {
      canvasContext.current.drawImage(imgRef.current, 0, 0);
      setPhoto(
        canvasContext.current.getImageData(0, 0, canvas.width, canvas.height)
      );
      const grid = gridRef.current;
      gridContext.current = grid.getContext("2d");
    }
  }, [loaded]);


  // const finish = () => {
  //   const diff = new GetDifference(drawing, photo)
  //   const drawingData = diff.simplifiedStringDrawing
  //   const photoData = diff.simplifiedStringPhoto
  //   debugger
  //   console.log(drawingData , photoData)
  // }


  const finish = () => {
    axios.post("/drawings", {name: name, drawing: drawing.data.toString(), })
    .then(res => {
      console.log('drawing created')
    })
  }

  return (
    <main>
      <div>
        {/* {grid} */}
        <button onClick={() => setLoaded(true)}> Get Photo </button>

        <canvas
          ref={gridRef}
          onMouseMove={draw}
          onClick={endLine}
          id="grid"
          width="342.96"
          height="480"
        ></canvas>
        {imageElement()}

        <canvas
          ref={canvasRef}
          id="canvas"
          width="342.96"
          height="480"
        ></canvas>
        <button onClick={finish}> Finish </button>
      </div>
    </main>
  );
};
