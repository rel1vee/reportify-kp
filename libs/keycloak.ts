import Keycloak from "keycloak-js";

const keycloakConfig = {
  url: process.env.NEXT_PUBLIC_KEYCLOAK_URL || "",
  realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM || "",
  clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT || "",
};

const keycloak = new Keycloak(keycloakConfig);

export default keycloak;