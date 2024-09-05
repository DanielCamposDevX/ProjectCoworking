import BackGround from '@/assets/blue-geometry.jpg';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LoginForm from '@/forms/loginForm';
import Image from 'next/image';
import Link from 'next/link';
import Transition from '../components/default/transitions';

export default function LoginPage() {
  return (
    <Transition>
      <div className="h-screen w-full flex justify-center items-center bg-[#4CA2A620]">
        <main className="flex flex-col lg:flex-row w-10/12 min-w-[350px] h-[85dvh] justify-start lg:justify-center items-center  bg-[#fefefe] rounded-2xl overflow-hidden">
          <div className="w-full lg:w-1/2 flex-1 max-h-52 lg:max-h-full lg:h-full bg-transparent relative flex flex-col justify-center items-center ">
            <div className="z-50 flex flex-col gap-4 ">
              <h1 className="text-white z-50 text-3xl font-extrabold ">
                Project Manager
              </h1>
              <h2 className="text-white z-50 text-lg hidden lg:flex">
                Novo por aqui? Crie sua conta:
              </h2>
              <Link href={'/signup'}>
                <Button
                  className="z-50 text-base px-10 py-6 rounded-full hidden lg:flex"
                  variant={'secondary'}
                >
                  Criar conta
                </Button>
              </Link>
            </div>
            <Image src={BackGround} alt="bg" fill className="absolute" />
          </div>

          <Card className="w-full lg:w-1/2 shadow-none flex flex-col justify-center items-center border-0 z-40 bg-[#fefefe] ">
            <CardHeader className="mb-5 flex justify-center items-center">
              <CardTitle className="text-accent-foreground text-xl">
                Bem vindo de volta!
              </CardTitle>
              <CardTitle className="text-accent-foreground text-lg font-medium">
                Para começar faça login
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col justify-center items-center">
              <LoginForm />
            </CardContent>
          </Card>
        </main>
      </div>
    </Transition>
  );
}
