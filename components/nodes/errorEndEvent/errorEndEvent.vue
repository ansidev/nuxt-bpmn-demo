<script>
import pull from 'lodash/pull'
import EndEvent from '~/components/nodes/endEvent/endEvent'
import errorIcon from '~/assets/error.svg'

export default {
  extends: EndEvent,
  props: ['moddle', 'rootElements', 'id'],
  data() {
    return {
      error: this.moddle.create('bpmn:Error', {
        id: `${this.id}_error`,
        name: `${this.id}_error`
      })
    }
  },
  mounted() {
    this.shape.attr('image/xlink:href', errorIcon)
    this.addErrorRef()
  },
  destroyed() {
    pull(this.rootElements, this.error)
  },
  methods: {
    addErrorRef() {
      if (this.node.definition.get('eventDefinitions')[0].errorRef) {
        this.error = this.node.definition.get('eventDefinitions')[0].errorRef
        return
      }

      this.error = this.moddle.create('bpmn:Error', {
        id: `${this.id}_error`,
        name: `${this.id}_error`
      })
      this.rootElements.push(this.error)
      this.node.definition.get('eventDefinitions')[0].errorRef = this.error
    }
  }
}
</script>
