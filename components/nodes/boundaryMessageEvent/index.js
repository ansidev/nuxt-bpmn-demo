import merge from 'lodash/merge'
import cloneDeep from 'lodash/cloneDeep'
import boundaryEventConfig from '../boundaryEvent'
import interruptingToggleConfig from '../boundaryEvent/interruptingToggleInspector'
import component from './boundaryMessageEvent.vue'

export const id = 'processmaker-modeler-boundary-message-event'
export default merge(cloneDeep(boundaryEventConfig), {
  id,
  component,
  control: false,
  label: 'Boundary Message Event',
  icon: require('@/assets/toolpanel/boundary-message-event.svg'),
  definition(moddle, $t) {
    return moddle.create('bpmn:BoundaryEvent', {
      name: $t('Boundary Message Event'),
      cancelActivity: true,
      eventDefinitions: [moddle.create('bpmn:MessageEventDefinition')]
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
