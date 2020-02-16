import merge from 'lodash/merge'
import cloneDeep from 'lodash/cloneDeep'
import boundaryEventConfig from '../boundaryEvent'
import component from './boundaryErrorEvent.vue'

export const id = 'processmaker-modeler-boundary-error-event'

export default merge(cloneDeep(boundaryEventConfig), {
  id,
  component,
  control: false,
  label: 'Boundary Error Event',
  icon: require('@/assets/toolpanel/boundary-error-event.svg'),
  definition(moddle, $t) {
    return moddle.create('bpmn:BoundaryEvent', {
      name: $t('Boundary Error Event'),
      eventDefinitions: [moddle.create('bpmn:ErrorEventDefinition')]
    })
  }
})
