<template>
  <div id="pdf-content"></div>
</template>

<script>
import pdf from 'pdfobject'

export default {
  name: "ViewPDF",
  props: {
    pdfUrl: {
      type: String,
      default: "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf"
    }
  },
  beforeMount () {
    var that = this;
    that.$nextTick(function () {
      pdf.embed(that.pdfUrl, "#pdf-content");
    })
  },
}
</script>

<style lang="less" scoped>
#pdf-content {
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 1;
}
</style>