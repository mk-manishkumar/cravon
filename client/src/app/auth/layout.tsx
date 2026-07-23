export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-900 p-4">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
        <div className="flex justify-center mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-indigo-600">Cravon</h1>
        </div>
        {children}
      </div>
    </div>
  );
}
