import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <SignUp 
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