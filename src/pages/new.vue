<template>
  <section>
    <div class="panel">
      <h3>Create new rule</h3>
      <div class="form">
        <input @keyup="onTyping" type="text" v-model="name" placeholder="Type a name" @keyup.enter="submit">
        <button @click="submit">Go</button>
      </div>
      <div class="error">{{ error }}</div>
      <div class="tip">Type an unique name for your new rule</div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, inject, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getRules, ruleContext } from '@/shared/rules'
import RuleImplement from '@/models/rule'
import builtinRules from '@/shared/builtin'

const NAME_PATTERN = /^[-_a-zA-Z0-9]+$/

export default defineComponent({
  props: {},
  emits: [],
  setup(props, { emit }){
    const router = useRouter()
    const name = ref('')
    const error = ref('')
    const { rules, addRule } = inject(ruleContext)!
    const validateName = () => {
      if (!name.value) {
        throw new Error('name cannot be empty')
      }
      if (!NAME_PATTERN.test(name.value)) {
        throw new Error(`name '${name.value}' is not match the pattern '${NAME_PATTERN}'`)
      }
      if (builtinRules.find(rule => rule.name === name.value)) {
        throw new Error(`name '${name.value}' is already used as builtin rule`)
      }
      if (rules.value.find(rule => rule.name === name.value)) {
        throw new Error(`name '${name.value}' is already used`)
      }
    }
    const submit = async () => {
      try {
        await validateName()
        const rule = new RuleImplement({ name: name.value}).sync()
        addRule(rule.toJSON())
        router.push(`/rules/${name.value}`)
      } catch (e) {
        error.value = e.message
      }
    }

    const onTyping = () => {
      error.value = ''
    }
  
    return {
      name,
      error,
      submit,
      onTyping,
    }
  }
})
</script>

<style lang="scss" scoped>
@import "@/styles/var.scss";

section {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.panel {
  width: 400px;
  border-radius: 4px;
  background: #fff;
  padding: 20px;
  border: 2px solid #eee;
}

h3 {
  font-weight: bold;
  font-size: 20px;
  color: #333;
}

.form {
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  input {
    height: 40px;
    text-indent: 1em;
    border: 2px solid #ccc;
    transition: border-color .3s;
    border-radius: 4px;
    width: calc(100% - 46px);
    &:hover, &:focus, &:active {
      border-color: $main-color;
    }
  }
  button {
    height: 40px;
    width: 40px;
    border: none;
    outline: none;
    color: $main-color;
    background: #fafafa;
    cursor: pointer;
    border-radius: 4px;
    transition: all .3s;
    font-size: 16px;
    &:hover {
      background: $main-color;
      color: #fff;
    }
  }
}

.error {
  color: #ea7c7c;
  margin-top: 10px;
}

.tip {
  margin-top: 16px;
  font-size: 12px;
  color: #aaa;
}
</style>