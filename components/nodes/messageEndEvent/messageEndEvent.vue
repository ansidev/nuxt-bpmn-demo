<script>
import pull from 'lodash/pull'
import EndEvent from '~/components/nodes/endEvent/endEvent'
import messageEndEventSymbol from '~/assets/message-end-event.svg'

export default {
  extends: EndEvent,
  props: ['node', 'rootElements', 'id'],
  data() {
    return {
      message: this.moddle.create('bpmn:Message', {
        id: `${this.id}_message`,
        name: `${this.id}_message`
      })
    }
  },
  mounted() {
    this.shape.attr('image/xlink:href', messageEndEventSymbol)
    this.addMessageRef()
  },
  destroyed() {
    pull(this.rootElements, this.message)
    this.$store.commit('removeMessageRef', this.message)
  },
  methods: {
    addMessageRef() {
      if (this.node.definition.get('eventDefinitions')[0].messageRef) {
        this.message = this.node.definition.get(
          'eventDefinitions'
        )[0].messageRef
        return
      }

      this.message = this.moddle.create('bpmn:Message', {
        id: `${this.id}_message`,
        name: `${this.id}_message`
      })
      this.rootElements.push(this.message)
      this.node.definition.get('eventDefinitions')[0].messageRef = this.message
    }
  }
}
</script>
