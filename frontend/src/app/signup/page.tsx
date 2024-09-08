import SignupForm from '@/forms/signup-form';
import Transition from '../../components/default/transitions';
import SideImage from './components/sideImage';

export default function SignupPage() {
  return (
    <Transition>
      <div className="h-screen w-full flex justify-center items-center bg-[#4CA2A620]">
        <main className="flex flex-col lg:flex-row w-10/12 min-w-[350px] h-[85dvh] justify-center items-center lg:justify-between  bg-[#fefefe] rounded-2xl overflow-hidden">
          <div className="w-full lg:w-1/2 h-full flex justify-center items-start lg:items-center overflow-y-scroll lg:overflow-y-hidden py-10">
            <SignupForm />
          </div>
          <SideImage />
        </main>
      </div>
    </Transition>
  );
}
