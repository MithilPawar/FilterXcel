import GoogleIcon from "../../assets/google.png";  
import FacebookIcon from "../../assets/facebook.png";  
import GithubIcon from "../../assets/github.png";  

const providers = [
  { 
    name: "Google", 
    bg: "bg-white border border-gray-300", 
    hover: "hover:bg-gray-100", 
    textColor: "text-gray-800", 
    icon: GoogleIcon 
  },
  { 
    name: "Facebook", 
    bg: "bg-blue-600", 
    hover: "hover:bg-blue-700", 
    textColor: "text-white", 
    icon: FacebookIcon 
  },
  { 
    name: "GitHub", 
    bg: "bg-gray-800", 
    hover: "hover:bg-gray-900", 
    textColor: "text-white", 
    icon: GithubIcon 
  },
];

const SocialAuthButtons = () => {
  return (
    <div className="mt-6 text-center">
      <p className="text-gray-600 dark:text-gray-400 mb-2">Or sign in with</p>
      <div className="flex gap-4 justify-center">
        {providers.map((provider) => (
          <button
            key={provider.name}
            className={`flex items-center gap-3 px-5 py-2.5 ${provider.bg} ${provider.textColor} font-semibold rounded-full ${provider.hover} transition focus:outline-none shadow-md`}
            aria-label={`Sign in with ${provider.name}`}
          >
            <img 
              src={provider.icon} 
              alt={`${provider.name} logo`} 
              className="w-6 h-6 object-contain"
            />
            {provider.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SocialAuthButtons;
