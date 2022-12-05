import {express} from "./deps.ts";
import { router } from "./product/product.routes.ts";


const app = express();
app.use(express.json());
app.use(router);

app.listen(3000);
console.log("listening on http://localhost:3000/");