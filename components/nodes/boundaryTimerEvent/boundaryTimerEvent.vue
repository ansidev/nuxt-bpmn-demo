<script>
import BoundaryEvent from '~/components/nodes/boundaryEvent/boundaryEvent'
import timerEventIcon from '~/assets/timer-event-icon.svg'

export default {
  extends: BoundaryEvent,
  mounted() {
    this.shape.attr('image/xlink:href', timerEventIcon)
  }
}
</script>
