import SideImage from '@/components/side-image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LoginForm from '@/forms/login-form';
import Transition from '../components/default/transitions';

export default function LoginPage() {
  return (
    <div
      className="h-screen w-full flex justify-center items-center bg-cover bg-no-repeat"
      style={{ backgroundImage: `url('/background.jpg')` }}
    >
      <Transition>
        <main className="flex flex-col lg:flex-row w-10/12 min-w-[350px] h-[85dvh] justify-start lg:justify-center items-center shadow-xl bg-[#ffffff] lg:bg-[#3F89EC] rounded-2xl overflow-y-scroll lg:overflow-hidden">
          <SideImage
            title="Transforme suas ideias em resultados!"
            subtitle="O Coworking é a solução ideal para equipes que desejam gerenciar projetos de forma integrada e eficiente. Com nossa plataforma, você pode planejar, colaborar e monitorar o progresso de suas atividades em um ambiente intuitivo e dinâmico."
            buttonText="Criar conta"
            link="/signup"
            side="right"
          />
          <Card className="w-full lg:w-1/2 h-full rounded-none rounded-ss-[80px] shadow-none flex flex-col justify-center items-center border-0 z-40 bg-[#ffffff] ">
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
      </Transition>
    </div>
  );
}
