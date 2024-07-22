export class SignUpDto {
  email: string;
  username: string;
  name: string;
  role: 'admin' | 'user';
  password: string;
  description?: string;
}
