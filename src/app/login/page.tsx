import { LoginForm } from '@/components/auth/LoginForm';

export default async function LoginPage(props: PageProps<'/login'>) {
  // Lối tắt /login?dangky=1 mở form tạo tài khoản, dùng để lập tài khoản giáo viên đầu tiên
  const params = await props.searchParams;
  return <LoginForm allowRegister={params.dangky === '1'} />;
}
