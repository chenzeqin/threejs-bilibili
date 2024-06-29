import { useElementSize, useResizeObserver } from '@vueuse/core';
import { onUnmounted, ref } from 'vue';

export function useContainer() {
  const el = ref<HTMLDivElement>();
  const { width, height } = useElementSize(el);

  const { stop } = useResizeObserver(el, () => {
    console.log(width.value, height.value);
  });

  onUnmounted(() => {
    stop();
  });

  return {
    el,
    width,
    height,
  };
}
