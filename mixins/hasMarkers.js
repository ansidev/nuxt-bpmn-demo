export const markersLimit = 3
export const markerSize = 16
export const markerPadding = 4

/**
 * Prepare nodes for the Markers to be inserted inside the shapes.
 *
 * @param string selector
 */
export function markersMarkup(selector) {
  const children = []
  for (let i = 0; i < markersLimit; i++) {
    children.push({ tagName: 'image', selector: selector + '.' + i })
  }
  return {
    tagName: 'g',
    selector,
    children
  }
}

/**
 * Define attributes for the markers.
 *
 * @param string name
 * @param object base
 * @param int length
 */
export function markersAttrs(name, base, inverted = 1) {
  const attrs = {}
  attrs[name] = base
  for (let i = 0; i < markersLimit; i++) {
    attrs[name + '.' + i] = {
      'ref-x': i * markerSize * inverted,
      'ref-y': 0,
      width: markerSize,
      height: markerSize
    }
  }
  return attrs
}

export default {
  data() {
    return {
      markers: {
        topLeft: {},
        topCenter: {},
        topRight: {},
        bottomLeft: {},
        bottomCenter: {},
        bottomRight: {}
      }
    }
  },
  watch: {
    markers: {
      inmediate: true,
      deep: true,
      handler() {
        this.recalcMarkersAlignment()
      }
    }
  },
  methods: {
    recalcMarkersAlignment(markers = this.markers) {
      const { width, height } = this.shape.size()
      for (const position in markers) {
        this.alignMarkersFromLeftToRight(position, width)
        this.alignMarkersFromBottom(position, height)
        this.alignMarkersFromCenter(position, markers, width)
      }
    },
    getPadding(position) {
      const padding = this.shape.attr(position)
      return padding === undefined ? markerPadding : padding
    },
    alignMarkersFromLeftToRight(position, width) {
      const paddingX = this.getPadding(position + '/ref-padding-x')
      if (position.includes('Right')) {
        this.shape.attr(position + '/ref-x', width - markerSize - paddingX)
      } else if (position.includes('Left')) {
        this.shape.attr(
          position + '/ref-x',
          paddingX + (this.hasTaskMarker ? 16 : 0)
        )
      }
    },
    alignMarkersFromBottom(position, height) {
      const paddingY = this.getPadding(position + '/ref-padding-y')
      if (position.includes('bottom')) {
        this.shape.attr(position + '/ref-y', height - markerSize - paddingY)
      }
    },
    alignMarkersFromCenter(position, markers, width) {
      let c = 0
      for (let i = 0; i < markersLimit; i++) {
        this.shape.attr(position + '.' + i + '/xlink:href', null)
      }
      for (const marker in markers[position]) {
        this.shape.attr(
          position + '.' + c + '/xlink:href',
          markers[position][marker]
        )
        c++
        if (c >= markersLimit) {
          break
        }
      }
      this.shape.attr(position + '/ref-width', markerSize * c)
      if (position.includes('Center')) {
        this.shape.attr(position + '/ref-x', (width - c * markerSize) / 2)
      }
    }
  }
}
