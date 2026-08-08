"use client";

const RegisterPage = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="mb-2 text-center text-3xl font-bold">Login</h1>

        <p className="mb-8 text-center text-gray-500">
          Sign in to your account
        </p>

        <form className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Email Address
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-black py-3 font-semibold text-white transition hover:bg-gray-800"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Don&#39;t have an account?{" "}
          <a
            href="/register"
            className="font-semibold text-black hover:underline"
          >
            Create Account
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
