"use client";

import React from "react";
import Loading from "./Loading";
import { useRouter } from "next/navigation";
import { useKeycloak } from "@react-keycloak/web";

const WithAuth = <P extends object>(
  Component: React.FC<P>,
  allowedRoles: string[]
) => {
  const AuthenticatedComponent = (props: P) => {
    const router = useRouter();
    const { keycloak, initialized } = useKeycloak();

    if (!initialized) {
      return <Loading />;
    }

    const roles: string[] =
      keycloak.tokenParsed?.resource_access?.["reportify-kp"]?.roles || [];

    const hasRole = roles.some((role) => allowedRoles.includes(role));

    if (!hasRole) {
      return router.push("/unauthorized");
    }

    return <Component {...props} />;
  };

  AuthenticatedComponent.displayName = `WithAuth(${
    Component.displayName || Component.name || "Component"
  })`;

  return AuthenticatedComponent;
};

export default WithAuth;
