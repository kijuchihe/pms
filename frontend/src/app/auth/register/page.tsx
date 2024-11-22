import { Metadata } from 'next';
import RegisterForm from '@/modules/auth/components/RegisterForm';

export const metadata: Metadata = {
  title: 'Register - Project Management System',
};

export default function RegisterPage() {
  return (
    <div className="flex h-screen items-center justify-center">
      <RegisterForm />
    </div>
  );
}
