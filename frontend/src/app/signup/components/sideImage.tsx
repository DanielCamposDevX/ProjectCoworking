import BackGround from '@/assets/blue-geometry.jpg';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

export default function SideImage() {
  return (
    <div className="w-full lg:w-1/2 flex-1 h-52 lg:h-full bg-transparent relative flex-col justify-center items-center  hidden lg:flex">
      <div className="z-50 flex flex-col gap-4 ">
        <h1 className="text-white z-50 text-3xl font-extrabold ">
          Project Manager
        </h1>
        <h2 className="text-white z-50 text-lg hidden lg:flex">
          Já tem uma conta?
        </h2>
        <Link href={'/'}>
          <Button
            className="z-50 text-base px-10 py-6 rounded-full hidden lg:flex"
            variant={'secondary'}
          >
            Fazer login
          </Button>
        </Link>
      </div>
      <Image src={BackGround} alt="bg" fill className="absolute" />
    </div>
  );
}
