import {redirect} from 'next/navigation';

export default function MyPageDefault() {
  redirect(`/mypagetest/myinfo`);
  return null;
}
