<template>
  <div class="settings">
    <section>
      <h3>Settings</h3>
      <main>
        <div class="name field">
          <input type="text" v-model="name" @blur="changeName" @keyup.enter="tryChangeName">
          <p>Change to rename</p>
        </div>
        <div class="desc field">
          <textarea v-model="desc" @blur="changeDesc"></textarea>
          <p>Add or update description for this rule</p>
        </div>
      </main>
    </section>
    <section>
      <h3>Danger</h3>
      <main>
        <el-popconfirm
          v-if="!rule.builtin"
          title="Are you sure to remove?"
          confirmButtonText="Yes"
          cancelButtonText="Cancel"
          @confirm="onRemove"
        >
          <template #reference>
            <button class="remove">Remove this rule</button>
          </template>
        </el-popconfirm>
      </main>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, inject, PropType, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Rule } from '@/typings'
import { ruleContext, NAME_PATTERN, validateName } from '@/shared/rules'
import { ElMessage } from 'element-plus'

export default defineComponent({
  props: {
    rule: {
      type: Object as PropType<Rule>,
      required: true,
    }
  },
  emits: [],
  setup(props, { emit }){
    const router = useRouter()
    const { update, remove, rules, rename } = inject(ruleContext)!
    const onRemove = () => {
      remove(props.rule)
      router.push(`/rules/${rules.value[0].name}/gen`)
    }
    const name = ref(props.rule.name)
    const desc = ref(props.rule.desc || '')

    const changeName = () => {
      const n = name.value.trim()
      if (n === props.rule.name) return
      try {
        validateName(n, rules.value)
        rename(props.rule.name, n)
        router.push(`/rules/${n}/settings`)
      } catch(e) {
        ElMessage.warning(e.message || 'Rule name is invalid')
        name.value = props.rule.name
      }
    }

    const tryChangeName = (e: any) => {
      // trigger rename
      e.target.blur()
    }

    const changeDesc = () => {
      const d = desc.value.trim()
      if (d === props.rule.desc) return
      const newRule = {
        ...props.rule,
        desc: d,
      }
      update(newRule)
    }

    return {
      name,
      desc,
      onRemove,
      changeName,
      changeDesc,
      tryChangeName,
    }
  }
})
</script>

<style lang="scss" scoped>
@import "@/styles/var.scss";

.settings {
  padding: 20px;
}

section {
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 4px;
  background: #fff;
  margin-bottom: 20px;
}

main {
  margin-top: 20px;
}

.remove {
  outline: none;
  padding: 6px 10px;
  border: 1px solid $danger-color;
  border-radius: 4px;
  background: #fff;
  color: $danger-color;
  cursor: pointer;
  transition: all .3s;
  &:hover {
    background: $danger-color;
    color: #fff;
  }
}

.name {
  input {
    font-size: 14px;
    height: 36px;
    width: 300px;
    text-indent: 1em;
  }
}

.desc {
  margin-top: 20px;
  textarea {
    width: 80%;
    padding: 1em;
    height: 160px;
  }
}


.field {
  input, textarea {
    outline: none;
    border-radius: 4px;
    background-color: #eee;
    border: 2px solid #eee;
    transition:background-color .3s, border-color .3s;
    &:hover, &:focus {
      border-color: $main-color;
      background-color: #fff;
    }
  }
  p {
    color: #999;
    margin-top: 6px;
  }
}
</style>