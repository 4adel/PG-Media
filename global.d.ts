declare global {
  namespace NodeJS {
    interface ProcessEnv {
      JWT_SECRT: string;
      MONGO_URI: string;
      PORT: string;
    }
  }
}
export {};
