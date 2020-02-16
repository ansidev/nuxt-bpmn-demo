<template>
  <div>
    <form-multi-select
      v-model="selectedProcess"
      label="Process"
      helper="Select which Process this element calls"
      :disabled="processList.length === 0"
      :options="processList"
      option-content="name"
      class="p-0 mb-2"
    />

    <form-multi-select
      v-if="selectedProcess"
      v-model="selectedStartEvent"
      label="Start Event"
      :disabled="startEventList.length === 0"
      :options="startEventList"
      option-content="name"
      class="p-0 mb-2"
    />

    <a
      v-if="selectedProcess"
      :href="`/modeler/${selectedProcess.id}`"
      target="_blank"
    >
      Open Process
      <i class="ml-1 fas fa-external-link-alt" />
    </a>
  </div>
</template>

<script>
import uniqBy from 'lodash/uniqBy'

export default {
  inheritAttrs: false,
  props: ['value'],
  data() {
    return {
      selectedProcess: null,
      selectedStartEvent: null,
      config: {},
      name: '',
      loading: false
    }
  },
  computed: {
    processList() {
      return this.$store.getters.globalProcesses || []
    },
    startEventList() {
      if (!this.selectedProcess) {
        return []
      }
      return this.selectedProcess.events
    }
  },
  watch: {
    selectedProcess() {
      if (this.loading) {
        return
      }
      if (this.startEventList.length > 0) {
        this.selectedStartEvent = this.startEventList[0]
      } else {
        this.selectedStartEvent = null
      }
    },
    selectedStartEvent() {
      if (this.loading) {
        return
      }
      this.setBpmnValues()
    },
    processList() {
      this.loadBpmnValues()
    },
    value: {
      handler() {
        this.config = JSON.parse(this.value)
      },
      immediate: true
    }
  },
  created() {
    if (this.processList.length === 0) {
      this.$store.dispatch('fetchGlobalProcesses')
    } else {
      this.loadBpmnValues()
    }
  },
  methods: {
    loadBpmnValues() {
      if (!this.config.processId || !this.config.startEvent) {
        return
      }

      this.loading = true
      this.name = this.config.name
      this.selectedProcess = this.processList.find(
        (p) => p.id === this.config.processId
      )
      this.selectedStartEvent = this.startEventList.find(
        (se) => se.id === this.config.startEvent
      )
      this.$nextTick(() => {
        this.loading = false
      })
    },
    setBpmnValues() {
      if (!this.selectedProcess || !this.selectedStartEvent) {
        return
      }

      let name = this.selectedProcess.name
      if (this.startEventList.length > 1) {
        name += ` (${this.selectedStartEvent.name})`
      }

      const emit = {
        calledElement: `${this.selectedStartEvent.ownerProcessId}-${this.selectedProcess.id}`,
        processId: this.selectedProcess.id,
        startEvent: this.selectedStartEvent.id,
        name
      }
      const stringValue = JSON.stringify(emit)
      this.$emit('input', stringValue)
    },
    containsMultipleProcesses(process) {
      return uniqBy(process.events, 'ownerProcessId').length > 1
    }
  }
}
</script>
