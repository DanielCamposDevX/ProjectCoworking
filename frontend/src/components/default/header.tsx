import { useAuth } from '@/app/context/AuthContext';
import Logo from '@/assets/logo.png';
import { LogOut } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';

export default function Header() {
  const { setToken } = useAuth();
  const router = useRouter();

  function handleSignOut() {
    setToken(null);
    router.push('/');
  }

  return (
    <div className="w-full bg-white/90">
      <div className="flex items-center justify-around z-50 h-32">
        <div
          className="flex items-center"
          onClick={() => {
            router.push('/dash');
          }}
        >
          <Image src={Logo} alt="Logo" className={`z-50 w-[200px]`} />
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleSignOut} className=" border">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <Separator orientation="horizontal" className="hidden md:flex" />
    </div>
  );
}
