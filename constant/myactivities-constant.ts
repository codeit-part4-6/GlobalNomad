import {Item} from '@/components/common/dropbox';
import {SelectOption} from '@/components/common/selectbox';

export const catagoryOptions: SelectOption[] = [
  {value: '문화 · 예술', label: '문화 · 예술'},
  {value: '식음료', label: '식음료'},
  {value: '스포츠', label: '스포츠'},
  {value: '투어', label: '투어'},
  {value: '관광', label: '관광'},
  {value: '웰빙', label: '웰빙'},
];

export const dropboxItems: Item[] = [
  {id: 1, label: '수정하기', type: 'modify'},
  {id: 2, label: '삭제하기', type: 'delete'},
];
