<template>
  <form-select
    v-bind="$attrs"
    :value="messageId"
    :disabled="messagesList.length === 0"
    :options="messagesList"
    class="p-0 mb-2"
    @input="emitMessage"
  />
</template>

<script>
import {
  getMessagesList,
  getMessage
} from './intermediateMessageCatchEventUtils'

export default {
  inheritAttrs: false,
  props: ['value'],
  computed: {
    messagesList() {
      return getMessagesList(this.$store)
    },
    messageId() {
      return this.value ? this.value.id : ''
    }
  },
  methods: {
    emitMessage(messageId) {
      const message = getMessage(this.$store, messageId)
      this.$emit('input', message)
    }
  }
}
</script>
