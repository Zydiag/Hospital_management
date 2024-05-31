const allowedOrigins = [
  'http://localhost:3000/',
  'http://localhost:5173/',
  'http://localhost:5173',
];

export const corsOptions = {
  // origin: function (origin, callback) {
  //   console.log('origin:', origin);
  //   if (!origin || allowedOrigins.indexOf(origin) !== -1) {
  //     console.log('origin', origin);
  //     callback(null, true);
  //   } else {
  //     callback(new Error('Not allowed by CORS'));
  //   }
  // },
  origin: '*',
  credentials: true,
};
