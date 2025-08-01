export default () => ({
  port: parseInt(process.env.PORT || '3001', 10),
  daml: {
    ledger: {
      host: process.env.DAML_LEDGER_HOST || 'localhost',
      port: parseInt(process.env.DAML_LEDGER_PORT || '6865', 10),
      httpPort: parseInt(process.env.DAML_LEDGER_HTTP_PORT || '7575', 10),
    },
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret-key-change-in-production',
    expiresIn: '1d',
  },
});
