<template>
  <crown-config
    :highlighted="highlighted"
    :paper="paper"
    :graph="graph"
    :shape="shape"
    :node="node"
    :node-registry="nodeRegistry"
    :moddle="moddle"
    :collaboration="collaboration"
    :process-node="processNode"
    :plane-elements="planeElements"
    :is-rendering="isRendering"
    :dropdown-data="dropdownData"
    v-on="$listeners"
  />
</template>

<script>
import portsConfig from '~/mixins/portsConfig'
import EventShape from '~/components/nodes/intermediateEvent/shape'
import hasMarkers from '~/mixins/hasMarkers'
import hideLabelOnDrag from '~/mixins/hideLabelOnDrag'
import CrownConfig from '~/components/crown/crownConfig/crownConfig'
import highlightConfig from '~/mixins/highlightConfig'

export default {
  components: {
    CrownConfig
  },
  mixins: [highlightConfig, portsConfig, hasMarkers, hideLabelOnDrag],
  props: [
    'graph',
    'node',
    'id',
    'highlighted',
    'nodeRegistry',
    'moddle',
    'paper',
    'collaboration',
    'processNode',
    'planeElements',
    'isRendering'
  ],
  data() {
    return {
      shape: null,
      definition: null,
      dropdownData: [
        {
          label: 'Intermediate Timer Event',
          nodeType: 'processmaker-modeler-intermediate-catch-timer-event'
        },
        // {
        //   label: 'Intermediate Signal Catch Event',
        //   nodeType: 'processmaker-modeler-intermediate-signal-catch-event',
        //   dataTest: 'switch-to-intermediate-signal-catch-event',
        // },
        // {
        //   label: 'Intermediate Signal Throw Event',
        //   nodeType: 'processmaker-modeler-intermediate-signal-throw-event',
        //   dataTest: 'switch-to-intermediate-signal-throw-event',
        // },
        {
          label: 'Intermediate Message Catch Event',
          nodeType: 'processmaker-modeler-intermediate-message-catch-event',
          dataTest: 'switch-to-intermediate-message-catch-event'
        },
        {
          label: 'Intermediate Message Throw Event',
          nodeType: 'processmaker-modeler-intermediate-message-throw-event',
          dataTest: 'switch-to-intermediate-message-throw-event'
        }
      ]
    }
  },
  watch: {
    'node.definition.name'(name) {
      this.shape.attr('label/text', name)
    }
  },
  mounted() {
    // Now, let's add a rounded rect to the graph
    this.shape = new EventShape()
    const bounds = this.node.diagram.bounds
    this.shape.position(bounds.get('x'), bounds.get('y'))
    this.shape.resize(bounds.get('width'), bounds.get('height'))
    this.shape.attr({
      label: {
        text: this.node.definition.get('name'),
        refY: '130%'
      }
    })
    this.shape.addTo(this.graph)
    this.shape.component = this
  }
}
</script>
