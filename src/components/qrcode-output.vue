<template>
  <div class="qrcode" >
    <div class="wrapper">
      <div class="container">
        <div v-if="qrcodeImage" @click="onShowBigger" class="img" :style="{backgroundImage: `url(${qrcodeImage})`}"></div>
        <div v-else-if="showLoading" v-loading="true" class="loading"></div>
        <div v-else class="tip">输入参数生成二维码</div>
      </div>
    </div>

    <div class="text" v-if="input">{{ input }}</div>
    <el-dialog v-model="showBigger" custom-class="frameless-dialog">
      <div v-if="showBigger" class="dialog">
        <img :src="qrcodeImage" />
        <p>{{ input }}</p>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue'
import QRCode from 'qrcode'

export default defineComponent({
  props: {
    generating: {
      type: Boolean,
    },
    input: {
      type: String
    }
  },
  setup(props) {
    const qrcodeImage = ref('')
    // generating: params -> text
    // parsing: text -> qrcode image
    const parsing = ref(false)
    const showLoading = computed(() => parsing.value || props.generating)
    const showBigger = ref(false)

    const parseToImage = async (text: string) => {
      parsing.value = true
      try {
        qrcodeImage.value = await QRCode.toDataURL(text)
      } catch(e) {
        qrcodeImage.value = ''
      }
      parsing.value = false
    }

    const onShowBigger = () => {
      if (qrcodeImage.value) {
        showBigger.value = true
      }
    }

    watch(() => props.input, raw => {
      if (raw) {
        parseToImage(raw)
      } else {
        qrcodeImage.value = ''
      }
    })
    return {
      showLoading,
      qrcodeImage,
      showBigger,
      onShowBigger,
    }
  }
})
</script>

<style scoped lang="scss">
.qrcode {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: #999;
}

.wrapper {
  width: 100%;
  padding-top: 100%;
  position: relative;
}

.container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 1px dashed #ccc;
}

.img {
  border: 1px dashed #ccc;
  width: 100%;
  padding-top: 100%;
  background: center/cover no-repeat #fafafa;
  position: relative;
  cursor: pointer;
}

.loading {
  width: 100%;
  height: 100%;
}

.tip {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
  color: #ccc;
}

.text {
  text-align: left;
  font-size: 12px;
  margin-top: 16px;
  white-space: pre-wrap;
  word-break: break-all;
}

.dialog {
  padding: 30px;
  text-align: center;
  img {
    min-width: 200px;
    max-width: 400px;
  }
  p {
    margin-top: 4px;
  }
}
</style>