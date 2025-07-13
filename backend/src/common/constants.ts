/**
 * Application-wide constants for DAML Exchange backend
 */

// JWT tokens for DAML JSON API authentication
export const DAML_TOKENS = {
  ALICE: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwczovL2RhbWwuY29tL2xlZGdlci1hcGkiOnsibGVkZ2VySWQiOiJzYW5kYm94IiwiYXBwbGljYXRpb25JZCI6IkhUVFAtSlNPTi1BUEktR2F0ZXdheSIsImFjdEFzIjpbIkFsaWNlIl19fQ.FIjS4ao9yu1XYnv1ZL3t7ooPNIyQYAHY3pmzej4EMCM',
  BOB: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwczovL2RhbWwuY29tL2xlZGdlci1hcGkiOnsibGVkZ2VySWQiOiJzYW5kYm94IiwiYXBwbGljYXRpb25JZCI6IkhUVFAtSlNPTi1BUEktR2F0ZXdheSIsImFjdEFzIjpbIkJvYiJdfX0.y6iwpnYt-ObtNo_FyLVxMtNTwpJF8uxzNfPELQUVKVg',
  BACKEND: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwczovL2RhbWwuY29tL2xlZGdlci1hcGkiOnsibGVkZ2VySWQiOiJzYW5kYm94IiwiYXBwbGljYXRpb25JZCI6ImRhbWwtZXhjaGFuZ2UtYmFja2VuZCIsImFjdEFzIjpbIkFsaWNlIl19fQ.Cj0dGxR0gZpwW5yR7jHNvqOzjEKjC5Mwvtk_6iNO-GQ'
};

// Authentication cookie for GraphQL API
export const GRAPHQL_AUTH_COOKIE = "_ga=GA1.1.444531873.1731571982; _ga_LLP0C2ZVWY=GS1.1.1731620083.3.0.1731620083.0.0.0; secure_customer_sig=; localization=VN; _tracking_consent=%7B%22con%22%3A%7B%22CMP%22%3A%7B%22a%22%3A%22%22%2C%22m%22%3A%22%22%2C%22p%22%3A%22%22%2C%22s%22%3A%22%22%7D%7D%2C%22v%22%3A%222.1%22%2C%22region%22%3A%22VNHN%22%2C%22reg%22%3A%22%22%2C%22purposes%22%3A%7B%22a%22%3Atrue%2C%22p%22%3Atrue%2C%22m%22%3Atrue%2C%22t%22%3Atrue%7D%2C%22display_banner%22%3Afalse%2C%22sale_of_data_region%22%3Afalse%2C%22consent_id%22%3A%223404F9EA-15f5-4F21-98ba-41ea89486013%22%7D; _shopify_y=0b54dc71-c5ed-4198-a3fa-ce408c3ac021; _shopify_essential=:AZPeMZkZAAH_baCUaOhGcCZujTsGvfsAghWsdbidKx3xZKbhUQ3BeTjsifb-SaZklNCRuLC5im4ZKuw3TMWQUa4jbW4FUubEDLBu0CJlXwQ9z__vQd_ZE8wESgJ3zBBm:; csrftoken=oLlCrTMHDTIf1BUquAufkbeqYHw8eByc; session-id=711f03a6-2815-4f51-b9d7-ea2e774f90b2";

// API endpoints
export const API_ENDPOINTS = {
  DAML_JSON_API: {
    QUERY: '/v1/query',
    PACKAGES: '/v1/packages',
    PARTIES: '/v1/parties'
  },
  GRAPHQL_API: {
    TEMPLATES: '/api/graphql'
  }
};

// Default configuration values
export const DEFAULT_CONFIG = {
  DAML: {
    LEDGER: {
      HOST: 'localhost',
      HTTP_PORT: 7575,
      GRAPHQL_PORT: 7500
    }
  }
};
