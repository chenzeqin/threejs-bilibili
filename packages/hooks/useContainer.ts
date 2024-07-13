import { useElementSize, useResizeObserver } from '@vueuse/core';
import { onUnmounted, ref } from 'vue';

export function useContainer() {
  const el = ref<HTMLDivElement>();
  const { width, height } = useElementSize(el);
  return {
    el,
    width,
    height,
  };
}
