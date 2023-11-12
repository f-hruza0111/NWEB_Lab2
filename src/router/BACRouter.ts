import express from 'express'
import data from '../accessData.js'

const BACRouter = express.Router()

BACRouter.use(setUserAndChecked)

BACRouter.get('/', (req, res) => {
    res.render('BACLogin', {checked: undefined, BAC: true, isAuthenticated: false})
})

BACRouter.post('/', (req, res) => {
    const username = req.body.username
    const password = req.body.password
    const checked = req.body.bac

    const user = data.users.find(user => user.name === username)
    
    req.session['checked'] = checked

    if(user != undefined && user.password === password) {
        req.session['user'] = user

        console.log(user.role + " " + user.id)


        var redirectURL = `/BAC/${user.role}`

        if(user.role == 'student'){redirectURL = redirectURL + '/'+ user.id}

        res.redirect(redirectURL)

    } else {
        res.status(403)
        res.send('Neispravne vjerodajnice')
    }
})

BACRouter.get('/logout', (req, res) => {
    req.session.destroy((err) => console.log(err))
    res.redirect('/BAC')
})

BACRouter.get('/student/:id', authenticate, authorizeStudentWithID, (req, res) =>{
    
    const user = req.session['user']
    const student = data.users.find(user => user.id == parseInt(req.params.id))
    const documents = data.documents.filter(document => document.userId == student?.id)

    if(documents != undefined){
       console.log(documents.length)

       for(const document of documents){
        console.log(document.name)
       }
    }

    var access = "omogućena"
    if(req.session['checked'] != undefined){access = "onemogućena"}
        
    if(student != undefined && student.role == "student"){
        res.render('documentList', {
            user: user, 
            documents: documents, 
            student: student,
            access: access,
            BAC:true,
            isAuthenticated: true
        })

    } else {
        res.status(403)
        res.send('Neautentificirani korisnik!')
    }
    
})

BACRouter.get('/mentor', authenticate, authorize(data.ROLE.MENTOR), (req, res)=> {
    const user = req.session['user']

    var access = "omogućena"
    if(req.session['checked'] != undefined){access = "onemogućena"}

    const students = data.users.filter(user => user.role == 'student')



    var access = "omogućena"
    if(req.session['checked'] != undefined){access = "onemogućena"}

    res.render('mentor', {
        user: user,
        students: students,
        documents: data.documents,
        access: access,
        BAC:true,
        isAuthenticated: true
    })
})

BACRouter.get('/documents/:docID', authenticate, authorizeViewDocument,(req, res) => {
    const docID = parseInt(req.params.docID)

    const document = data.documents.find(document => document.id == docID)
    const owner = data.users.find(user => user.id == document?.userId)

    var access = "omogućena"
    if(req.session['checked'] != undefined){access = "onemogućena"}

    if(document != undefined){
        res.render('document', {
            user: req.session['user'],
            document: document,
            owner: owner,
            access: access,
            BAC:true,
            isAuthenticated: true
        })
    } else {
        res.status(404)
        res.send(`Error 404: Dokument s id ${docID} nije pronađen`)
    }

    
})



//middleware
function authenticate(req, res, next){
    if(req.session['user'] == undefined){
        res.status(403)
        res.send('Error 403: Molim vas, prijavite se da biste pristupili stranici.')
    } else {
        next()
    }
}

function authorize(role) {
    return (req, res, next) => {

        if(req.session['checked'] == undefined && req.session['user'].role !== role){
            res.status(401)
            return res.send('Error 401: Nemate pristup ovom resursu!')
        }

        next()
    }
}

function setUserAndChecked(req, res, next){
    const userID = req.body.userID
    if(userID) {
        req.user = data.users.find(user => user.id === userID)
    }

    const checked = req.body.bac
    if(checked != undefined){
        req.checked = "checked"
    }

    next()
}

function authorizeStudentWithID(req, res, next){
    
    const user = req.session['user']
    if(req.session['checked'] == undefined && user.role != 'mentor' && user.id != req.params.id){
        res.status(401)
        return res.send('Error 401: Nemate pristup ovom resursu!')
    }

    next()
    
}

function authorizeViewDocument(req, res, next) {
    const docID = req.params.docID

    const document = data.documents.find(document => document.id == parseInt(docID))

    const user = req.session['user']
    if(req.session['checked'] == undefined && user.role != 'mentor' && user.id != document?.userId){
        res.status(401)
        return res.send('Error 401: Nemate pristup ovom resursu!')
    }

    next()
}


export default BACRouter;