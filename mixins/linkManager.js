import { anchors } from 'jointjs'
import { getDefaultAnchorPoint } from '~/utils/portsUtils'

export default function initAnchor() {
  anchors.closestPort = (
    endView,
    endMagnet,
    anchorReference,
    { getConnectionPoint, shape, paper }
  ) => {
    return getDefaultAnchorPoint(getConnectionPoint(), shape.findView(paper))
  }
}
