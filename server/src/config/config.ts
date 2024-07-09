const corsOptions = {
  origin: [
    "http://localhost:3001",
    "http://localhost:3000",
    process.env.CLIENT_URL as string,
    "*",
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

const CHATTU_TOKEN = "chattu-token";

export { corsOptions, CHATTU_TOKEN };
