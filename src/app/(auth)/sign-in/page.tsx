import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <SignIn 
        appearance={{
          elements: {
            card: "shadow-md",
            headerTitle: "text-2xl font-bold",
            headerSubtitle: "text-sm text-gray-500",
          }
        }}
      />
    </div>
  );
}