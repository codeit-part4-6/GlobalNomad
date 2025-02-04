import {create} from 'zustand';

interface RenderState {
  render: boolean;
  updateRender: () => void;
}

export const renderStore = create<RenderState>(set => ({
  render: false,
  updateRender: () => set(state => ({render: !state.render})),
}));

renderStore.subscribe(state => {
  console.log('🔄 상태 변경 감지:', state);
});
