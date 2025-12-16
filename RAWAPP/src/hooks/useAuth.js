import { useSelector } from "react-redux";

export default function useAuth() {
  const { user, token, loading, error } = useSelector((state) => state.auth);
  return { user, token, loading, error, isLoggedIn: !!token };
}
