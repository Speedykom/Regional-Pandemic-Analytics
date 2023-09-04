export const Unauthorized = () => {
  return (
    <div>
      <section className="flex items-center h-full p-16">
        <div className="container flex flex-col items-center justify-center px-5 mx-auto my-8">
          <div className="max-w-md text-center">
            <h2 className="mb-8 font-extrabold text-9xl dark:text-gray-600">
              <span className="sr-only">Error</span>401
            </h2>
            <p className="text-xl font-semibold md:text-xl">
              The request has not been applied because it lacks valid
              authorisation for the target resource.
            </p>
            <p className="mt-4 mb-8 dark:text-gray-400">
              Don't worry though, there is always a way to go back home.
            </p>
            <a
              rel="noopener noreferrer"
              href="#"
              className="px-8 py-3 font-semibold border bg-green-600 text-white rounded"
            >
              Go Back
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
