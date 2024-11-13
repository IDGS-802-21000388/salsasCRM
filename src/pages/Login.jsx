import { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { login } from "../services/authService";
import { Bounce, toast } from "react-toastify";

const Login = () => {
  const [correo, setCorreo] = useState("");
  const [contrasenia, setContrasenia] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await login(correo, contrasenia);
      toast.success("Inicio de sesión exitosa.", {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      console.log("Login exitoso:", response);
      localStorage.setItem("token", response.token);
    } catch (error) {
      toast.error(
        "Error al iniciar sesión. Por favor, verifica tus credenciales.",
        {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        }
      );
      console.error("Error en login:", error);
    }
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/images/background-login.jpg')" }}
    >
      <div className="w-[420px] bg-transparent border border-white/20 backdrop-blur-lg shadow-lg text-white rounded-lg p-10">
        <h1 className="text-3xl font-semibold text-center mb-8">Iniciar Sesión</h1>

        <form onSubmit={handleLogin}>
          <div className="relative mb-6">
            <input
              type="email"
              placeholder="Email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="w-full h-12 px-4 pl-12 bg-transparent border border-white/20 rounded-full text-white placeholder-white outline-none focus:ring-2 focus:ring-white/50"
            />
            <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-lg" />
          </div>

          <div className="relative mb-8">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={contrasenia}
              onChange={(e) => setContrasenia(e.target.value)}
              className="w-full h-12 px-4 pl-12 bg-transparent border border-white/20 rounded-full text-white placeholder-white outline-none focus:ring-2 focus:ring-white/50"
            />
            <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-lg" />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-lg focus:outline-none"
            >
              {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full h-12 bg-white text-gray-900 font-semibold rounded-full shadow-md hover:shadow-lg hover:bg-gray-200 transition duration-300"
          >
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
