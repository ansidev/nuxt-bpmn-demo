import merge from 'lodash/merge'
import cloneDeep from 'lodash/cloneDeep'
import boundaryEventConfig from '../boundaryEvent'
import interruptingToggleConfig from '../boundaryEvent/interruptingToggleInspector'
import component from './boundaryEscalationEvent.vue'

export const id = 'processmaker-modeler-boundary-escalation-event'

export default merge(cloneDeep(boundaryEventConfig), {
  id,
  component,
  control: false,
  label: 'Boundary Escalation Event',
  icon: require('@/assets/toolpanel/boundary-escalation-event.svg'),
  definition(moddle, $t) {
    return moddle.create('bpmn:BoundaryEvent', {
      name: $t('Boundary Escalation Event'),
      cancelActivity: true,
      eventDefinitions: [moddle.create('bpmn:EscalationEventDefinition')]
    })
  },
  inspectorConfig: [
    {
      items: [
        {
          items: [{}, interruptingToggleConfig]
        }
      ]
    }
  ]
})
