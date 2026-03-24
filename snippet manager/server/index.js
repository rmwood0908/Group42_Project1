require('dotenv').config();

const pool = require('./infrastructure/db');
const config = require('./infrastructure/config');
const createExpressApp = require('./infrastructure/expressApp');

const PostgresSnippetRepository = require('./adapters/outbound/db/PostgresSnippetRepository');
const PostgresUserRepository = require('./adapters/outbound/db/PostgresUserRepository');
const BcryptPasswordHasher = require('./adapters/outbound/security/BcryptPasswordHasher');
const JwtTokenService = require('./adapters/outbound/security/JwtTokenService');

const CreateSnippet = require('./core/usecases/CreateSnippet');
const GetSnippets = require('./core/usecases/GetSnippets');
const GetSnippetById = require('./core/usecases/GetSnippetById');
const UpdateSnippet = require('./core/usecases/UpdateSnippet');
const DeleteSnippet = require('./core/usecases/DeleteSnippet');
const RegisterUser = require('./core/usecases/RegisterUser');
const LoginUser = require('./core/usecases/LoginUser');

const AuthController = require('./adapters/inbound/http/authController');
const SnippetController = require('./adapters/inbound/http/snippetController');
const createAuthRoutes = require('./adapters/inbound/http/authRoutes');
const createSnippetRoutes = require('./adapters/inbound/http/snippetRoutes');
const authMiddlewareFactory = require('./adapters/inbound/http/authMiddleware');

const snippetRepository = new PostgresSnippetRepository(pool);
const userRepository = new PostgresUserRepository(pool);
const passwordHasher = new BcryptPasswordHasher();
const tokenService = new JwtTokenService(config.jwtSecret);

const createSnippet = new CreateSnippet(snippetRepository);
const getSnippets = new GetSnippets(snippetRepository);
const getSnippetById = new GetSnippetById(snippetRepository);
const updateSnippet = new UpdateSnippet(snippetRepository);
const deleteSnippet = new DeleteSnippet(snippetRepository);

const registerUser = new RegisterUser(userRepository, passwordHasher, tokenService);
const loginUser = new LoginUser(userRepository, passwordHasher, tokenService);

const authController = new AuthController({
  registerUser,
  loginUser
});

const snippetController = new SnippetController({
  getSnippets,
  getSnippetById,
  createSnippet,
  updateSnippet,
  deleteSnippet
});

const authMiddleware = authMiddlewareFactory(tokenService);

const authRoutes = createAuthRoutes(authController);
const snippetRoutes = createSnippetRoutes(snippetController, authMiddleware);

const app = createExpressApp({
  authRoutes,
  snippetRoutes
});

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});