<template>
  <div class="mt-3">
    <label>{{ $t('Recurring loop repeats at time interval set below') }}</label>
    <b-input-group>
      <b-form-input
        v-model="repeat"
        type="number"
        min="1"
        class="form-control control repeat"
        :data-test="repeatInput"
      />

      <b-input-group-append>
        <b-form-select v-model="periodicity" data-test="periods">
          <option
            v-for="period in periods"
            :key="period.name"
            :value="period"
            >{{ $t(period.name) }}</option
          >
        </b-form-select>
      </b-input-group-append>
    </b-input-group>
  </div>
</template>

<script>
import last from 'lodash/last'

const periodNames = {
  minute: 'minute',
  hour: 'hour',
  day: 'day',
  week: 'week',
  month: 'month'
}

export default {
  props: ['value', 'repeatInput'],
  data() {
    const periods = [
      { name: periodNames.minute, value: 'M', isTime: true },
      { name: periodNames.hour, value: 'H', isTime: true },
      { name: periodNames.day, value: 'D' },
      { name: periodNames.week, value: 'W' },
      { name: periodNames.month, value: 'M' }
    ]

    return {
      repeat: null,
      periodicity: null,
      periods
    }
  },
  computed: {
    cycleExpression() {
      if (this.periodicity.isTime) {
        return `R/PT${this.repeat}${this.periodicity.value}`
      }
      return `R/P${this.repeat}${this.periodicity.value}`
    }
  },
  watch: {
    value: {
      handler(value) {
        this.periodicity = this.getPeriodFromDelayString(value)
        this.repeat = this.getRepeatNumberFromDelayString(value)
      },
      immediate: true
    },
    cycleExpression: {
      handler(cycleExpression) {
        this.$emit('input', cycleExpression)
      },
      immediate: true
    }
  },
  methods: {
    getPeriodFromDelayString(delayString) {
      const isTimePeriod = this.isTimePeriod(delayString)
      const periodicity = last(delayString)

      if (periodicity === 'M') {
        const periodName = isTimePeriod ? periodNames.minute : periodNames.month

        return this.periods.find(({ name }) => name === periodName)
      }

      return this.periods.find(({ value }) => value === periodicity)
    },
    isTimePeriod(delayString) {
      return delayString[3] === 'T'
    },
    getRepeatNumberFromDelayString(delayString) {
      const match = delayString.match(/\d+/)
      return match && match[0]
    }
  }
}
</script>
