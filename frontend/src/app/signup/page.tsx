import SideImage from "@/components/side-image";
import SignupForm from "@/forms/signup-form";
import Transition from "../../components/default/transitions";

export default function SignupPage() {
  return (
    <div
      className="h-screen w-full flex justify-center items-center bg-cover bg-no-repeat"
      style={{ backgroundImage: `url('/background.jpg')` }}
    >
      <Transition>
        <main className="flex flex-col-reverse lg:flex-row w-10/12 min-w-[350px] h-[85dvh] justify-start lg:justify-center items-center shadow-xl bg-[#ffffff] lg:bg-[#71B6FB] rounded-2xl overflow-y-scroll lg:overflow-hidden">
          <div className="w-full bg-white lg:w-1/2 lg:h-full flex justify-center items-start lg:items-center py-10 rounded-ee-[80px] lg:overflow-y-scroll">
            <SignupForm />
          </div>
          <SideImage
            title="Transforme suas ideias em resultados!"
            subtitle="O Coworking é a solução ideal para equipes que desejam gerenciar projetos de forma integrada e eficiente. Com nossa plataforma, você pode planejar, colaborar e monitorar o progresso de suas atividades em um ambiente intuitivo e dinâmico."
            buttonText="Fazer login"
            link="/"
            side="left"
          />
        </main>
      </Transition>
    </div>
  );
}
