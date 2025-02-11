import {redirect} from 'next/navigation';

export default function MyPageDefault() {
  redirect(`/mypage/myinfo`);
}
