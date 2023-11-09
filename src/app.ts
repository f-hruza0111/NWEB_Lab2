import express from 'express'
import session from 'express-session'
import XSSRouter from './router/XSSRouter.js'
import BACRouter from './router/BACRouter.js'
import { Session } from 'inspector'
// import cookieParser from 'cookie-parser'



declare global {
    namespace Express {
        export interface Request {
            
            user: {
                name: string,
                id: number,
                password: string,
                role: string
            }
            checked? : string
        }
    }

   
} 

// const filename = fileURLToPath(import.meta.url);

// const __dirname = path.dirname(filename);



const app = express();


const externalUrl = process.env.RENDER_EXTERNAL_URL
const port = externalUrl && process.env.PORT ? parseInt(process.env.PORT) : 3000



const baseURL = externalUrl || `http://localhost:${port}`




  


app.use(express.urlencoded());
app.use(express.json());  
app.use(session({
    secret: "JOFDhoFIOjfJfJOPIfwsjDslkfJ",
}))   
// app.use(cookieParser()) 


// console.log(__dirname)

app.set('views', './views')
app.set('view engine', 'ejs');

app.get("/", async (req, res) => {
   
        res.render('index', {
            BAC:false,
            isAuthenticated: false
        })
})

app.use('/XSS', XSSRouter)
app.use('/BAC', BACRouter)




if(externalUrl){

    const hostname = '0.0.0.0'
    app.listen(port, hostname, () => {
        console.log(`Server running locally on  http://${hostname}:${port} and externaly on ${externalUrl}`);
    })
} else {
    app.listen(port, () => {
        console.log(`Server running locally on  ${baseURL}`);
    })
}

