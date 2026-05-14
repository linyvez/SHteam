import Header from "../components/Header";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col bg-shteam-bg text-base-content">
      <Header type="signup" />
      <main className="flex-1 flex flex-col gap-2 items-center justify-center p-4">
        {children}
      </main>
    </div>
  );
};

export default AuthLayout;
