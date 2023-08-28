import { Button } from '@tremor/react';
import { useRouter } from 'next/router';

export const LinkExpired = () => {
  const router = useRouter();
  return (
    <div className="grid h-screen container mx-auto w-full">
      <div className="flex flex-col items-center justify-center px-6 my-12">
        <div className="w-full xl:w-3/4 lg:w-11/12 flex">
          <div
            className="w-full h-auto bg-white hidden lg:block lg:w-1/2 bg-cover rounded-l-lg"
            style={{
              backgroundImage: "url('/images/expired.png')",
            }}
          />
          <div className="w-full lg:w-1/2 bg-white p-5 rounded-lg lg:rounded-l-none">
            <div className="px-8 mb-4">
              <h3 className="pt-4 mb-2 text-2xl">
                Your reset password link has expired
              </h3>
              <p className="mb-4 text-sm text-gray-700">
                We get it, stuff happens. your request to reset your password
                has expired! or has already been used.
              </p>
              <p className="mb-4 text-sm text-gray-700">
                Do you still want to reset your password? Click the button below
                to do just that.
              </p>
            </div>
            <div className="px-8 mb-4">
              <p className="mb-4 text-sm text-gray-700">
                Note: the password reset link is only valid for 5 hours and can
                only be used ones
              </p>
            </div>
            <div className="px-8 mb-10 mt-10">
              <Button
                className="w-full px-4 py-2 font-bold text-white bg-prim hover:bg-prim-hover focus:outline-none focus:shadow-outline"
                onClick={() => router.push('/users/reset-password')}
              >
                Reset Password
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
