 class GetDifference {
  constructor(drawing, image) {
    this.drawing = drawing;
    this.image = image;
  }


  get simplifiedStringDrawing() {
      return this.simpleStringifyDrawing()
  }

  get simplifiedStringPhoto() {
    return this.simpleStringifyPhoto()
}

  simpleStringifyDrawing() {
    return this.drawing.data.reduce(function (acc, el, i) {
        return el !== 0 ? acc.concat(i) : acc;
      }, []);
  }

  simpleStringifyPhoto() {
    debugger
    return this.image.data.reduce((acc,el,i) => (el !== 0 ? acc.concat(i) : acc),[])
  }



}

export default GetDifference;
