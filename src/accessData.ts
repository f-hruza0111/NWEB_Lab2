const ROLE = {
    MENTOR: 'mentor',
    STUDENT: 'student'
}

const data = {
    ROLE: ROLE,
    users: [
        {id: 1, name: "student1", password:"password", role: ROLE.STUDENT},
        {id: 2, name: "student2", password:"password", role: ROLE.STUDENT},
        {id: 3, name: "student3", password:"password", role: ROLE.STUDENT},
        {id: 4, name: "mentor", password:"password", role: ROLE.MENTOR},
    ],

    documents: [
        {id: 1, name: "Student 1 dokument", content:"Ovo vidi samo student 1 i mentori", userId: 1},
        {id: 2, name: "Student 2 dokument", content:"Ovo vidi samo student 2 i mentori", userId: 2},
        {id: 3, name: "Student 3 dokument", content:"Ovo vidi samo student 3 i mentori", userId: 3},

        {id: 4, name: "Mentor dokument", content:"Ovo vidi samo mentor", userId: 4}
    ]
}

export default data