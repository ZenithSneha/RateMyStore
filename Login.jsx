import { useForm } from "react-hook-form";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await API.post("/login", data);
      localStorage.setItem("token", response.data.token); // save token
      alert("Login successful!");
      navigate("/dashboard"); // redirect to dashboard or homepage
    } catch (err) {
      console.log(err); // errors already handled in api.js
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("email")} placeholder="Email" />
      <input {...register("password")} type="password" placeholder="Password" />
      <button type="submit">Login</button>
    </form>
  );
}
