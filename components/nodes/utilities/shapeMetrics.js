export const shapeBottom = (shape) => shape.position().y + shape.size().height
export const shapeLeft = (shape) => shape.position().x
export const shapeCenterX = (shape) =>
  shape.position().x + shape.size().width / 2
export const shapeCenterY = (shape) =>
  shape.position().y + shape.size().height / 2
export const shapeRight = (shape) => shape.position().x + shape.size().width
export const shapeTop = (shape) => shape.position().y
