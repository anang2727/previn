import RegisterForm from "@/app/components/molecules/register/RegisterForm";

const RegisterLayout = () => {
  return (
    <div className="flex h-screen flex-col md:flex-row bg-[#fffef8] overflow-hidden">
      {/* Left section: form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <RegisterForm />
      </div>

      {/* Right section: image */}
      <div className="hidden md:block flex-1 relative">
        <img
          src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=900&q=80"
          alt="Register illustration"
          className="object-cover w-full h-full"
        />
        {/* Accent bubble */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-yellow-300 opacity-30 rounded-full blur-2xl" />
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-blue-300 opacity-30 rounded-full blur-2xl" />
      </div>
    </div>
  );
};

export default RegisterLayout;
