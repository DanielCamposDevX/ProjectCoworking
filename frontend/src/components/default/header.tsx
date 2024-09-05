import { UserIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Separator } from '../ui/separator';

export default function Header() {
  return (
    <div>
      <div className="px-6 py-10 flex items-center justify-between z-50">
        <div className="flex">
          <Avatar className="w-7 h-7 mr-2">
            <AvatarImage />
            <AvatarFallback>
              <UserIcon />
            </AvatarFallback>
          </Avatar>
          <h1 className="text-xl hidden md:flex font-bold cursor-pointer">
            P<span className="text-blue-400">Manager</span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {/* {props.userdata && (
          <>
            <Button
              variant={'outline'}
              className="bg-gray-950/70 border-green-400/50"
              onClick={() => navigate('/user')}
            >
              <span className="text-sm text-muted-foreground mr-2 hidden md:flex">
                {props.userdata.displayName
                  ? props.userdata.displayName
                  : 'Meu Perfil'}
              </span>
              <Avatar className="w-7 h-7 md:mr-2">
                <AvatarImage
                  src={
                    props.userdata.photoURL
                      ? props.userdata.photoURL
                      : undefined
                  }
                />
                <AvatarFallback>
                  <UserIcon />
                </AvatarFallback>
              </Avatar>
            </Button>
            <Button
              variant={'outline'}
              onClick={handlesignOut}
              className="bg-gray-950/70 border-green-400/50"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </>
        )} */}
        </div>
      </div>
      <Separator orientation="horizontal" className="hidden md:flex" />
    </div>
  );
}
