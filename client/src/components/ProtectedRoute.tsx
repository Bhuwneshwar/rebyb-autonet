import { useEffect } from "react";
import { useGlobalContext } from "../MyRedux";
import { Navigate, Outlet } from "react-router-dom";
const ProtectedRoute = ({
  aspactRole,
  redirect,
}: {
  aspactRole: string;
  redirect: string;
}) => {
  const {
    store: { role },
  } = useGlobalContext();

  useEffect(() => {
    if (role !== aspactRole) <Navigate to={redirect} />;
  }, []);
  return <Outlet />;
};

export default ProtectedRoute;
