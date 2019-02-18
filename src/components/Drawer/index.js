class Drawer {
  constructor (canvas) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');

    this.zones = [];

    this.x1 = 0;
    this.x2 = 0;
    this.y1 = 0;
    this.y2 = 0;

    this.prevProperties = [0, 0, 0, 0];

    this.clearListeners();
    this.isDrawing = false;

    this.handelMouseUp = this.handelMouseUp.bind(this);
    this.handelMouseMove = this.handelMouseMove.bind(this);
    this.handelMouseDown = this.handelMouseDown.bind(this);
    this.clearZones = this.clearZones.bind(this);
  }

  handelMouseDown (e) {
    this.isDrawing = true;

    this.x1 = e.offsetX;
    this.y1 = e.offsetY;
  }

  handelMouseMove (e) {
    if (this.isDrawing) {
      this.clearPreviousRect();

      this.x2 = e.offsetX;
      this.y2 = e.offsetY;

      const rectProperties = this.getRectProperties();

      this.drawRect(rectProperties);
      this.prevProperties = rectProperties;
    }
  }

  handelMouseUp (e) {
    this.isDrawing = false;

    this.clearPreviousRect();

    this.x2 = e.offsetX;
    this.y2 = e.offsetY;

    const rectProperties = this.getRectProperties();

    this.drawRect(rectProperties);
    this.prevProperties = [0, 0, 0, 0];
    this.saveZones();
  }

  drawRect (rectProperties, color = 'red') {
    this.ctx.strokeStyle = color;
    this.ctx.rect(...rectProperties);
    this.ctx.stroke();
  }

  clearPreviousRect () {
    const [x, y, width, heigth] = this.prevProperties;

    this.ctx.clearRect(x - 1, y - 1, width + 2, heigth + 2);
    this.ctx.beginPath();
  }

  saveZones () {
    const leftUpCorner = this.getLeftUpCorner();
    const rightDownCorner = this.getRightDownCorner();

    this.zones.push([...leftUpCorner, ...rightDownCorner]);
  }

  /**
   * Method draws rectangles got from API
   */
  drawOldZones (rectArray) {
    this.zones = rectArray;

    rectArray.forEach(dimensions => {
      const rectProperties = [dimensions[0], dimensions[1]];
      const width = dimensions[2] - dimensions[0];
      const height = dimensions[3] - dimensions[1];

      rectProperties.push(width);
      rectProperties.push(height);

      this.drawRect(rectProperties);
    })
  }

  getLeftUpCorner () {
    const { x1, x2, y1, y2 } = this;

    return [Math.min(x1, x2), Math.min(y1, y2)]
  }

  getRightDownCorner () {
    const { x1, x2, y1, y2 } = this;

    return [Math.max(x1, x2), Math.max(y1, y2)]
  }

  getRectProperties () {
    const leftUpCorner = this.getLeftUpCorner();
    const rightDownCorner = this.getRightDownCorner();

    let width = rightDownCorner[0] - leftUpCorner[0];
    let height = rightDownCorner[1] - leftUpCorner[1];

    return [...leftUpCorner, width, height];
  }

  start () {
    this.canvas.addEventListener('mousedown', this.handelMouseDown)
    this.canvas.addEventListener('mouseup', this.handelMouseUp)
    this.canvas.addEventListener('mousemove', this.handelMouseMove)
  }

  clearListeners () {
    this.canvas.removeEventListener('mousedown', this.handelMouseDown)
    this.canvas.removeEventListener('mouseup', this.handelMouseUp)
    this.canvas.removeEventListener('mousemove', this.handelMouseMove)
  }

  getZones () {
    return this.zones;
  }

  clearZones () {
    this.zones = [];
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.beginPath();
  }

  reset () {
    this.clearListeners();
    this.clearZones();
  }
}

export default Drawer;
