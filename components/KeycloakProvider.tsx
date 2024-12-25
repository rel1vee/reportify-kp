"use client";

import keycloak from "../libs/keycloak";
import { ReactKeycloakProvider } from "@react-keycloak/web";

export default function KeycloakProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReactKeycloakProvider authClient={keycloak}>
      {children}
    </ReactKeycloakProvider>
  );
}
