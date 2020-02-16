<script>
import BoundaryEvent from '~/components/nodes/boundaryEvent/boundaryEvent'
import getIntermediateMailIconShapeAttributes from '~/mixins/intermediateMailIcon'
import boundaryMessageMailSymbol from '~/assets/boundary-message-event.svg'

export default {
  extends: BoundaryEvent,
  mounted() {
    const shapeAttributes = getIntermediateMailIconShapeAttributes(
      boundaryMessageMailSymbol
    )
    this.shape.attr(shapeAttributes)
  },
  methods: {
    isValidBoundaryEventTarget(model) {
      const component = model.component
      return component && component.node.isBpmnType('bpmn:CallActivity')
    }
  }
}
</script>
