<template>
  <div class="home">
    <div class="inner">
      <img src="/logo.svg" />
      <h3>
        Anything to qrcode
        <span>for developer</span>
      </h3>
      <p>Write a rule, you can convert anything to a qrcode</p>

      <h4>One simple step to create your qrcode rule</h4>
      <div class="steps">
        <div class="step iface">
          <img src="https://to-qrcode.oss-cn-beijing.aliyuncs.com/iface.png" alt="">
          <p>Define an interface along with a function, we'll do everything else for you.</p>
        </div>
        <div class="step form">
          <img src="https://to-qrcode.oss-cn-beijing.aliyuncs.com/form.png" alt="">
          <p>Including auto convert your interface to a smart form, run you function, and obviously, generate qrocde according to your function output</p>
        </div>
      </div>
      <ul>
        <li>All data stored on your computer, safe and fast.</li>
        <li>
          <div>
            <img src="/ts.svg" alt="TypeScript">
            <span> is our good friend. Interface, function, everything you already familier with.</span>
          </div>
        </li>
        <li>Easy to share by url.</li>
        <li>Start by <router-link to="/new">create</router-link> your first rule right now.</li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'

// TODO an intro page here
export default defineComponent({
  props: {},
  emits: [],
  setup(props, { emit }){
    return {}
  }
})
</script>

<style lang="scss" scoped>
.home {
  padding: 20px;
  width: 100%;
  height: 100%;
}

.inner {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  flex-direction: column;
}

h3 {
  margin-top: 60px;
  padding-bottom: 6px;
  font-size: 26px;
  color: #4284f3;
  border-bottom: 3px solid #fabc05;
  span {
    font-size: 12px;
    color: #ea4335;
  }
}

ul {
  margin-top: 100px;
  li {
    margin: 10px 0;
    list-style: none;
    div {
      display: flex;
      align-items: center;
      img {
        width: 18px;
        margin-right: 4px;
      }
    }

    a {
      color: #4284f3;
      font-weight: 900;
    }
  }
}

h4 {
  margin-top: 100px;
  font-size: 22px;
}

.steps {
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  margin-top: 30px;
}

.step {
  margin: 0 5%;
  img {
    font-size: 0;
    width: 100%;
    border-radius: 8px;
    box-shadow: 0 1px 2px rgba(0,0,0,0.07), 
      0 2px 4px rgba(0,0,0,0.07),
      0 4px 8px rgba(0,0,0,0.07),
      0 8px 16px rgba(0,0,0,0.07),
      0 16px 32px rgba(0,0,0,0.07),
      0 32px 64px rgba(0,0,0,0.07);
  }
  p {
    text-align: center;
    margin-top: 40px;
    font-size: 16px;
    color: #999;
  }
  &.iface {
    width: 30%;
  }
  &.form {
    width: 44%;
  }
}
</style>