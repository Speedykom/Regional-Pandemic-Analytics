import { Loader } from "./loader";

export default function GlobalLoad() {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="flex justify-center flex-col space-y-5 items-center">
          <div className="w-20 h-20">
            <Loader />
          </div>
        </div>
      </div>
    );
}
