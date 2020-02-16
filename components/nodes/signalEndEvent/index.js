import merge from 'lodash/merge'
import cloneDeep from 'lodash/cloneDeep'
import endEventConfig from '../endEvent'
import component from './signalEndEvent.vue'

export const id = 'processmaker-modeler-signal-end-event'

export default merge(cloneDeep(endEventConfig), {
  id,
  component,
  control: false,
  label: 'Signal End Event',
  definition(moddle, $t) {
    return moddle.create('bpmn:EndEvent', {
      name: $t('Signal End Event'),
      eventDefinitions: [moddle.create('bpmn:SignalEventDefinition')]
    })
  }
})
