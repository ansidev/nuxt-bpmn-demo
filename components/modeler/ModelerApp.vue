<template>
  <b-container id="modeler-app" class="h-100 container position-relative p-0">
    <b-card no-body class="h-100 rounded-0">
      <b-card-header class="d-flex align-items-center header">
        <b-card-text class="m-0 font-weight-bolder">
          {{ $t('ProcessMaker Modeler') }}
        </b-card-text>

        <div class="ml-auto">
          <b-btn
            v-b-modal="'uploadmodal'"
            variant="secondary"
            size="sm"
            class="mr-2"
          >
            <i class="fas fa-upload mr-1" />
            {{ $t('Upload XML') }}
          </b-btn>
          <b-btn
            variant="secondary"
            size="sm"
            data-test="downloadXMLBtn"
            @click="download"
          >
            <i class="fas fa-download mr-1" />
            {{ $t('Download XML') }}
          </b-btn>
        </div>
      </b-card-header>
      <b-card-body class="overflow-hidden position-relative p-0 vh-100">
        <modeler
          ref="modeler"
          @validate="validationErrors = $event"
          @warnings="warnings = $event"
        />
      </b-card-body>
      <validation-status
        :validation-errors="validationErrors"
        :warnings="warnings"
      />
    </b-card>

    <b-modal
      id="uploadmodal"
      ref="uploadmodal"
      :title="$t('Upload BPMN File')"
      :cancel-title="$t('Cancel')"
      :ok-title="$t('Upload')"
      :ok-disabled="!uploadedXml"
      cancel-variant="outline-secondary"
      ok-variant="secondary"
      @hidden="clearUpload"
      @ok="loadXmlIntoModeler"
    >
      <file-upload v-model="xmlFile" class="btn btn-primary">
        {{ $t('Select file') }}
      </file-upload>

      <span v-if="xmlFile[0]" class="ml-3">{{ xmlFile[0].name }}</span>
    </b-modal>
  </b-container>
</template>

<script>
import FileUpload from 'vue-upload-component'
import FilerSaver from 'file-saver'
import Modeler from '~/components/modeler/Modeler.vue'
import ValidationStatus from '~/components/validationStatus/ValidationStatus.vue'
import runningInCypressTest from '~/utils/runningInCypressTest'

const reader = new FileReader()

export default {
  name: 'ModelerApp',
  components: {
    Modeler,
    FileUpload,
    ValidationStatus
  },
  data() {
    return {
      validationErrors: {},
      uploadedXml: null,
      xmlFile: [],
      warnings: []
    }
  },
  watch: {
    xmlFile([fileObject]) {
      if (fileObject) {
        reader.readAsText(fileObject.file)
      }
    }
  },
  created() {
    reader.onload = this.setUploadedXml
  },
  methods: {
    download() {
      this.$refs.modeler.toXML((err, xml) => {
        if (err) {
          alert(err)
        } else {
          if (runningInCypressTest()) {
            /* Save XML string to window–this is used in testing to compare against known valid XML */
            window.xml = xml
            return
          }
          const file = new File([xml], 'bpmnProcess.xml', { type: 'text/xml' })
          FilerSaver.saveAs(file)
        }
      })
    },
    loadXmlIntoModeler() {
      this.$refs.modeler.loadXML(this.uploadedXml)
    },
    clearUpload() {
      this.uploadedXml = null
      this.xmlFile = []
    },
    setUploadedXml(event) {
      this.uploadedXml = event.target.result
    }
  }
}
</script>

<style lang="scss">
body,
html {
  margin: 0;
  padding: 0;
  width: 100vw;
  max-width: 100vw;
  height: 100vh;
  max-height: 100vh;
}
</style>
