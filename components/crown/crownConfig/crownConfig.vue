<template>
  <div v-if="showCrown" class="crown-config" :style="style" role="menu">
    <slot />

    <association-flow-button
      :node="node"
      :moddle="moddle"
      :shape="shape"
      v-on="$listeners"
      @toggle-crown-state="showCrown = $event"
    />

    <sequence-flow-button
      :node="node"
      :sequence-flow-config="nodeRegistry['processmaker-modeler-sequence-flow']"
      :moddle="moddle"
      v-on="$listeners"
      @toggle-crown-state="showCrown = $event"
    />

    <message-flow-button
      :node="node"
      :moddle="moddle"
      :shape="shape"
      v-on="$listeners"
      @toggle-crown-state="showCrown = $event"
    />

    <crown-dropdowns
      :dropdown-data="dropdownData"
      :boundary-event-dropdown-data="boundaryEventDropdownData"
      :node="node"
      :node-registry="nodeRegistry"
      :moddle="moddle"
      :shape="shape"
      :task-dropdown-initially-open="taskDropdownInitiallyOpen"
      @replace-node-type="replaceNodeTypePrompt"
      v-on="$listeners"
    />

    <delete-button
      :graph="graph"
      :shape="shape"
      :node="node"
      v-on="$listeners"
    />

    <b-modal
      id="modal-prevent-closing"
      ref="modal"
      v-model="showReplaceModal"
      :title="$t('Change Type')"
      :ok-title="$t('Confirm')"
      :cancel-title="$t('Cancel')"
      @hidden="showReplaceModal = false"
      @ok="confirmedReplaceNodeType"
    >
      <p>
        {{ $t('Changing this type will replace your current configuration') }}
      </p>
    </b-modal>
  </div>
</template>

<script>
import pull from 'lodash/pull'
import { mapGetters } from 'vuex'
import DeleteButton from '~/components/crown/crownButtons/deleteButton'
import MessageFlowButton from '~/components/crown/crownButtons/messageFlowButton'
import SequenceFlowButton from '~/components/crown/crownButtons/sequenceFlowButton'
import AssociationFlowButton from '~/components/crown/crownButtons/associationFlowButton'
import CrownDropdowns from '~/components/crown/crownButtons/crownDropdowns'
import poolLaneCrownConfig from '~/mixins/poolLaneCrownConfig'
import { removeFlows } from '~/components/crown/utils.js'

export default {
  components: {
    CrownDropdowns,
    DeleteButton,
    MessageFlowButton,
    SequenceFlowButton,
    AssociationFlowButton
  },
  mixins: [poolLaneCrownConfig],
  props: {
    highlighted: Boolean,
    paper: Object,
    graph: Object,
    shape: Object,
    node: Object,
    nodeRegistry: Object,
    moddle: Object,
    planeElements: Array,
    processNode: Object,
    collaboration: Object,
    isRendering: Boolean,
    dropdownData: {
      type: Array,
      default: () => []
    },
    boundaryEventDropdownData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      showCrown: false,
      savePositionOnPointerupEventSet: false,
      style: null,
      taskDropdownInitiallyOpen: this.paperNotRendered(),
      showReplaceModal: false,
      nodeToReplace: null
    }
  },
  computed: {
    isFlow() {
      return [
        'processmaker-modeler-sequence-flow',
        'processmaker-modeler-message-flow'
      ].includes(this.node.type)
    },
    isTextAnnotation() {
      return this.node.type === 'processmaker-modeler-text-annotation'
    },
    process() {
      return this.node.pool
        ? this.node.pool.component.containingProcess
        : this.processNode.definition
    },
    ...mapGetters(['highlightedShapes', 'allowSavingElementPosition'])
  },
  watch: {
    highlighted(highlighted) {
      this.showCrown = highlighted
      if (!highlighted) {
        this.taskDropdownInitiallyOpen = false
      }
    },
    shape() {
      if (this.highlighted) {
        this.showCrown = true
      }
    }
  },
  created() {
    this.$t = this.$t.bind(this)
  },
  async mounted() {
    await this.$nextTick()
    await this.paperDoneRendering()

    this.setUpCrownConfig()
    this.setUpPositionHandling()
  },
  destroyed() {
    this.shape.stopListening()
    this.shape.remove()

    pull(this.process.get('flowElements'), this.node.definition)
    pull(this.planeElements, this.node.diagram)
    pull(this.process.get('artifacts'), this.node.definition)

    if (this.collaboration) {
      pull(this.collaboration.get('messageFlows'), this.node.definition)
    }
  },
  methods: {
    paperNotRendered() {
      return !this.isRendering
    },
    removeFlows,
    replaceNodeTypePrompt(node) {
      if (this.taskDropdownInitiallyOpen) {
        this.$emit('replace-node', node)
        return
      }
      this.showReplaceModal = true
      this.nodeToReplace = node
    },
    confirmedReplaceNodeType() {
      this.removeFlows(this.graph, this.shape)
      this.$emit('replace-node', this.nodeToReplace)
    },
    setNodePosition() {
      this.shape.stopListening(
        this.paper,
        'element:pointerup',
        this.setNodePosition
      )
      this.savePositionOnPointerupEventSet = false

      if (!this.allowSavingElementPosition) {
        return
      }

      this.$emit('save-state')
    },
    repositionCrown() {
      const shapeView = this.shape.findView(this.paper)

      if (!shapeView) {
        return
      }

      const { x, y, width } = shapeView.getBBox({
        useModelGeometry: !this.isTextAnnotation && !this.isFlow
      })

      this.style = {
        top: `${y - 45}px`,
        left: `${x + width - 20}px`,
        cursor: 'pointer'
      }
    },
    paperDoneRendering() {
      if (!this.isRendering) {
        return
      }

      Promise((resolve) => this.paper.once('render:done', resolve))
    },
    setUpCrownConfig() {
      this.paper.on(
        'render:done scale:changed translate:changed',
        this.repositionCrown
      )
      this.shape.on(
        'change:position change:size change:attrs',
        this.repositionCrown
      )

      if (!this.planeElements.includes(this.node.diagram)) {
        this.planeElements.push(this.node.diagram)
      }

      const nodeTypes = Object.keys(
        this.node.definition.$descriptor.allTypesByName
      )

      if (
        nodeTypes.includes('bpmn:FlowElement') &&
        !this.process.get('flowElements').includes(this.node.definition)
      ) {
        this.process.get('flowElements').push(this.node.definition)
      }

      if (
        nodeTypes.includes('bpmn:Artifact') &&
        !this.process.get('artifacts').includes(this.node.definition)
      ) {
        this.process.get('artifacts').push(this.node.definition)
      }

      if (
        this.collaboration &&
        nodeTypes.includes('bpmn:MessageFlow') &&
        !this.collaboration.get('messageFlows').includes(this.node.definition)
      ) {
        this.collaboration.get('messageFlows').push(this.node.definition)
      }
    },
    setUpPositionHandling() {
      this.shape.on('change:position', (element, newPosition) => {
        this.node.diagram.bounds.x = newPosition.x
        this.node.diagram.bounds.y = newPosition.y

        if (!this.savePositionOnPointerupEventSet) {
          this.shape.listenToOnce(
            this.paper,
            'element:pointerup',
            this.setNodePosition
          )
          this.savePositionOnPointerupEventSet = true
        }
      })
    }
  }
}
</script>

<style lang="scss" src="./crownConfig.scss" />
