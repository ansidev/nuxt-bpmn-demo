import { dia, util } from 'jointjs'
import { defaultNodeColor, invalidNodeColor } from '~/components/nodeColors'

export default class PaperManager {
  _paper
  preventTranslate = false

  constructor(paper) {
    this._paper = paper
  }

  static gridSize = 10

  static factory(element, interactiveFunc, model) {
    const defaultPadding = 3
    const paper = new dia.Paper({
      async: true,
      el: element,
      model,
      sorting: 'sorting-approximate',
      gridSize: PaperManager.gridSize,
      drawGrid: true,
      clickThreshold: 10,
      perpendicularLinks: true,
      interactive: interactiveFunc,
      highlighting: {
        default: { options: { padding: defaultPadding } }
      }
    })

    paper.translate(168, 20)

    return new this(paper)
  }

  get paper() {
    return this._paper
  }

  get scale() {
    return this._paper.scale()
  }

  set scale(scale) {
    this._paper.scale(scale)
    this._paper.trigger('scale:changed')
  }

  roundToNearestGridMultiple(number) {
    return Math.round(number / PaperManager.gridSize) * PaperManager.gridSize
  }

  translate(x, y) {
    if (this.preventTranslate) {
      return
    }

    this._paper.translate(x, y)
    this._paper.trigger('translate:changed')
  }

  addEventHandler(eventName, callback, callbackScope) {
    this._paper.on(eventName, callback, callbackScope)
  }

  addOnceHandler(eventName, callback) {
    this._paper.once(eventName, callback)
  }

  removeEventHandler(eventName, callback, callbackScope) {
    this._paper.off(eventName, callback, callbackScope)
  }

  setPaperDimensions(width, height) {
    this._paper.setDimensions(width, height)
  }

  async performAtomicAction(callback) {
    this._paper.freeze()
    await callback(this._paper)
    this._paper.unfreeze()
  }

  clientToGridPoint(clientX, clientY) {
    const paperOrigin = this._paper.localToPagePoint(0, 0)
    const scale = this.scale

    return {
      x: this.roundToNearestGridMultiple((clientX - paperOrigin.x) / scale.sx),
      y: this.roundToNearestGridMultiple((clientY - paperOrigin.y) / scale.sy)
    }
  }

  setStateInvalid() {
    this.paper.drawBackground({ color: invalidNodeColor })
  }

  setStateValid() {
    this.paper.drawBackground({ color: defaultNodeColor })
  }

  awaitScheduledUpdates() {
    if (
      this._paper._updates.priorities.some((updates) => !util.isEmpty(updates))
    ) {
      return new Promise((resolve) => {
        this.addOnceHandler('render:done', resolve)
      })
    }
    return Promise.resolve()
  }
}
