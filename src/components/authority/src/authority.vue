<script lang="ts">
import { defineComponent } from 'vue'
import { definePropType } from '@/utils'
import { usePermissionStore } from '@/store'

export default defineComponent({
  name: 'Authority',
  props: {
    value: {
      type: definePropType<string | string[]>([Array, String])
    }
  },

  setup(props, { slots }) {
    const { hasPermission } = usePermissionStore()
    return () => {
      return hasPermission(props.value) ? slots.default?.() : null
    }
  }
})
</script>
