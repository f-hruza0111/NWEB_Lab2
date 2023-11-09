import express from 'express'
import xss from 'xss'


const XSSRouter = express.Router()


async function controller(req, res) {
    
    console.log(req.body.httpOnly)

    var setHttpOnly = true
    var checked = false; 

    if(req.body.httpOnly == false){
        setHttpOnly = false;
        checked = true;
    }

    res.cookie('cookie', 'SECRET_VALUE_OF_COOKIE', {
        httpOnly: setHttpOnly
    })
    res.render('xss', {
        message: req.body.message, 
        checked: setHttpOnly ? undefined : "checked", 
        BAC:false,
        isAuthenticated: false
    })

}

async function postController(req, res, next) {
    var checked = req.body.xss
    var message : string = req.body.comment

  
    req.body.httpOnly = true;


    if(checked == undefined){
       message = xss(message)
    } else {
        req.body.httpOnly = false;
    }

    req.body.message = message
    
    console.log(req.body.message)

    console.log(req.body.httpOnly)
    return next()
    
}

XSSRouter.get('/', controller)

XSSRouter.post('/', postController, controller)


export default XSSRouter;