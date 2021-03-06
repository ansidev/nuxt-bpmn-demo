import component from './endEvent.vue'
import idConfigSettings from '~/components/inspectors/idConfigSettings'
import nameConfigSettings from '~/components/inspectors/nameConfigSettings'

export default {
  id: 'processmaker-modeler-end-event',
  component,
  bpmnType: 'bpmn:EndEvent',
  control: true,
  category: 'BPMN',
  icon: require('@/assets/toolpanel/end-event.svg'),
  label: 'End Event',
  rank: 3,
  definition(moddle, $t) {
    return moddle.create('bpmn:EndEvent', {
      name: $t('End Event')
    })
  },
  diagram(moddle) {
    return moddle.create('bpmndi:BPMNShape', {
      bounds: moddle.create('dc:Bounds', {
        height: 36,
        width: 36,
        x: null,
        y: null
      })
    })
  },
  allowOutgoingFlow() {
    return false
  },
  inspectorConfig: [
    {
      name: 'End Event',
      items: [
        {
          component: 'FormAccordion',
          container: true,
          config: {
            initiallyOpen: true,
            label: 'Configuration',
            icon: 'cog',
            name: 'inspector-accordion'
          },
          items: [
            {
              component: 'FormInput',
              config: nameConfigSettings
            }
          ]
        },
        {
          component: 'FormAccordion',
          container: true,
          config: {
            initiallyOpen: false,
            label: 'Advanced',
            icon: 'cogs',
            name: 'inspector-accordion'
          },
          items: [
            {
              component: 'FormInput',
              config: idConfigSettings
            }
          ]
        }
      ]
    }
  ]
}
