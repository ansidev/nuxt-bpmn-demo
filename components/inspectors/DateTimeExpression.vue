<template>
  <div class="mt-3">
    <form-date-picker
      :emit-iso="true"
      data-format="datetime"
      :label="$t('Wait until specific date/time')"
      control-class="form-control"
      class="p-0"
      :value="convertFromUTC(value)"
      data-test="date-picker"
      helper="Select the date to trigger this element"
      @input="emitValue"
    />
  </div>
</template>

<script>
import { DateTime } from 'luxon'

export default {
  props: {
    value: String
  },
  data() {
    return {
      DateTime
    }
  },
  methods: {
    getTimezone() {
      if (
        typeof window.ProcessMaker !== 'undefined' &&
        window.ProcessMaker.user
      ) {
        return window.ProcessMaker.user.timezone || 'local'
      }

      return 'local'
    },
    convertFromUTC(utcDatetimeString) {
      return DateTime.fromISO(utcDatetimeString, { zone: 'utc' })
        .setZone(this.getTimezone())
        .toISO()
    },
    emitValue(localDatetimeString) {
      const utcDatetimeString = DateTime.fromISO(localDatetimeString)
        .toUTC()
        .toISO()

      this.$emit('input', utcDatetimeString)
    }
  }
}
</script>
