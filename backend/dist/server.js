"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const express_graphql_1 = require("express-graphql");
const schema_1 = require("./schema/schema");
const app = (0, express_1.default)();
//Initializing env file
dotenv_1.default.config({ path: "./.env" });
//Connecting to MongoDB
function connectToMongo() {
    return __awaiter(this, void 0, void 0, function* () {
        const conn = yield mongoose_1.default.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connect: ${conn.connection.host}`);
    });
}
connectToMongo();
//Middlewares
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/graphql", (0, express_graphql_1.graphqlHTTP)({
    schema: schema_1.Schema,
    graphiql: process.env.NODE_ENV == "development",
}));
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
