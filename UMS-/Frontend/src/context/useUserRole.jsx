import { useContext } from "react";
import UserRoleContext from "./UserRoleContext";

const useUserRole = () => {
  return useContext(UserRoleContext);
};

export default useUserRole;
