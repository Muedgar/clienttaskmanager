'use client'

import React, { useEffect, useId, useState } from "react"
import { CldUploadWidget } from 'next-cloudinary';
import Link from "next/link";

export default function ViewTask() {
   
  // ids
  let collaboratorId = useId()
  let assigneeId = useId()
  // to keep things simple all states must be on this page.
  // name field
  const [name, setName] = useState('')

  // task duration
  const [taskDuration, setTaskDuration] = useState(["1","2"])
  const handleDatesRemoval = (id:string) => {
    if(taskDuration.length===1) return
    let newTaskDuration = taskDuration.filter((val) => val!=id)
    setTaskDuration(newTaskDuration)
  }
  const addDate = () => {
    let newDate = taskDuration.length + 1
    let newTaskDuration = [...taskDuration, `${newDate}`]
    setTaskDuration(newTaskDuration)
  }

  // assignee 
  const [emailA, setEmailA] = useState('')
  const [firstNameA, setFirstNameA] = useState('')
  const [lastNameA, setLastNameA] = useState('')
  // assigne form
  const [assigneeForm, setAssigneeForm] = useState(false)
  // collaborators array 
  const [assigneesSelected, setAssigneesSelected] = useState('')
  // collaborator
  const [selectedCollaborator, setSelectedCollaborator] = useState('')
  const [emailC, setEmailC] = useState('')
  const [firstNameC, setFirstNameC] = useState('')
  const [lastNameC, setLastNameC] = useState('')
  // assigne form
  const [collaboratorForm, setCollaboratorForm] = useState(false)

  // collaborators array 
  const [collaborators, setCollaborators] = useState([''])


  const handleCollaborators = () => {
    console.log(selectedCollaborator)
    let found = 0
    for (let index = 0; index < collaborators.length; index++) {
      const element = collaborators[index];
      if(element===selectedCollaborator) {
        found = 1;
      }
      
    }
    if(found===1) {
      return
    }
    let newCollabs = [...collaborators, selectedCollaborator]
    setCollaborators(newCollabs)
  }

  // projects 
  const [projectName, setProjectName] = useState('')
  const [projectDescription, setProjectDescription] = useState('')
  const [projectVal, setProjectVal] = useState('')
  // assigne form
  const [projectForm, setProjectForm] = useState(false)


  // task description
  const [taskDescription, setTaskDescription] = useState('')
  const [characterLimit, setCharacterLimit] = useState(false)

  // priority
  const [currentPriority, setCurrentPriority] = useState('low')

  // call users
  let callUsers = "call users"

  const [users, setUsers] = useState<any>([])

  useEffect(() => {
    async function getData(){
      await fetch("http://localhost:3004/user")
      .then(d => d.json())
      .then(d => setUsers(d))
      .catch(e => console.log(e))
    }
    getData() 
  },[callUsers])

    const [projectsData, setProjectsData] = useState([])

  useEffect(() => {
    async function getData(){
      await fetch("http://localhost:3004/project")
      .then(d => d.json())
      .then(d => setProjectsData(d))
      .catch(e => console.log(e))
    }
    getData() 
  },[callUsers])


  let [info, updateInfo] = useState<any>([]);
  const [error, updateError] = useState<any>();
  // handle file upload

function handleClickUploadImage(result: any, widget: any, error: any) {
    if ( error ) {
      updateError(error);
      return;
    }
    
    updateInfo([...info, result?.info.secure_url])
   showInfo()

    widget.close({
      quiet: true
    });
  }

  function showInfo() {
     console.log("results  ", info)
  }


const [nameCharacterLimit, setNameCharacterLimit] = useState(false)

const handleTask = async () => {
  console.log(name.length)
  // name validation
  if(nameCharacterLimit) {
    alert("one or more fields are not properly filled.")
    return
  }
  if(name.length<3) {
    console.log()
    alert("Name must of length greater than 3") 
    return
  }
  if(characterLimit) {
    alert("one or more fields are not properly filled.")
    return
  }
  let newStartDate = new Date(startDate)
  let newEndDate = new Date(endDate)
  if(newStartDate>=newEndDate) {
    alert("start date can't be the same or greater than end date")
      return
  }

  let data = {
    name,
    task_duration:  [`${startDate}&${endDate}`],
    assignees: [assigneesSelected],
    collaborators: collaborators.filter(collab => collab.length>1),
    project_id: projectVal,
    description: taskDescription,
    priority: currentPriority,
    attached: info,
  }
  console.log(data)
  if(!updateThisUser) {
    alert("Something went wrong")
    return
  }
  
 await fetch("http://localhost:3004/task/"+updateThisUser, {
    method: "PATCH",
    mode: "cors", 
    cache: "no-cache", 
    credentials: "include", 
    headers: {
      "Content-Type": "application/json",
     
    },
    body: JSON.stringify(data), 
  }).then(d => d.json())
  .then(d => {
    alert("Successfully updated task")
  })
}

const [startDate, setStartDate] = useState<any>('')
const [endDate, setEndDate] = useState<any>('')

const [updateThisUser, setUpdateThisUser] = useState('')
//  get single task
let singletask = "get"
useEffect(() => {
  async function getData() {
    await fetch("http://localhost:3004/task/"+localStorage.getItem("currentview"))
      .then(d => d.json())
      .then(d => {
        setUpdateThisUser(d.id)
        setName(d.name)
        let start = new Date(d.task_duration[0].split('&')[0])
        let middle = start.getMonth().toString().length===1?`0${start.getMonth()+1}`:start.getMonth()+1
        let last = start.getDate().toString().length===1?`0${start.getDate()}`:start.getDate()
        setStartDate(`${start.getFullYear()}-${middle}-${last}`)
        
        let end = new Date(d.task_duration[0].split('&')[1])
        
        let middleend = end.getMonth().toString().length===1?`0${end.getMonth()+1}`:end.getMonth()+1
        let lastend = end.getDate().toString().length===1?`0${end.getDate()}`:end.getDate()
        let endString = `${end.getFullYear()}-${middleend}-${lastend}`
        
        setEndDate(endString)

        //  set assignee
        setAssigneesSelected(d.assignees[0])

        setProjectVal(d.project_id.id)
        // set collaborators array
        setCollaborators(d.collaborators)
        // set projects
        // set description
        setTaskDescription(d.description)
        // set priority
        setCurrentPriority(d.priority)
        // set files array
        updateInfo(d.attached)
        
      })
      .catch(e => console.log(e))
  }
  getData()
},[singletask])
  return (
    <div className='w-[80%] h-fit scroll-auto bg-orange-200 m-auto pb-[30px]'>
      <div className='w-full h-[70px] flex justify-between'>
        <h1 className='m-[30px] font-bold text-lg'>View task</h1>
        <div className='flex'>
          <Link href={'/alltasks'} className='m-[30px] cursor-pointer border border-zinc-950 h-fit pl-4 pr-4 relative hover:text-white hover:bg-black hover:shadow-md hover:shadow-gray-900'>Close</Link>
        </div>
      </div>

      {/* name field */}
      <div className="pl-[30px] pt-[30px]">
        <p className="pb-2 font-bold text-md">Name  {15 - name.length} characters remaining</p>
        <input onKeyUp={e => {
         let remChars = 15 - name.length
         if(remChars>0) {
          setNameCharacterLimit(false)
         }else {
          setNameCharacterLimit(true)
         }
        }} className={
          nameCharacterLimit?
          "outline-none p-[5px] border-2 border-red-500 w-[80%] focus:shadow-md focus:shadow-gray-900":
          "outline-none p-[5px] border-2 border-green-600 w-[80%] focus:shadow-md focus:shadow-gray-900"
        } type='text' value={name} onChange={e => setName(e.target.value)} placeholder="Take name" />
      </div>

<div className="flex justify-start">
         <div className="pl-[30px] pt-[20px] w-[40%]">
          <p className="pb-2 font-bold text-md">Start Date</p>
          <input value={startDate} onChange={e => setStartDate(e.target.value)} className="outline-none p-[5px] w-full focus:shadow-md focus:shadow-gray-900" type='date' />
        </div>
         <div className="pl-[30px] pt-[20px] w-[40%]">
          <p className="pb-2 font-bold text-md">End Date</p>
          <input value={endDate} onChange={e => setEndDate(e.target.value)} className="outline-none p-[5px] w-full focus:shadow-md focus:shadow-gray-900" type='date' />
        </div>
      </div>
      {/* date field
      {taskDuration.map((id,ky) => (
        <div key={ky} className="flex justify-start">
         <div className="pl-[30px] pt-[20px] w-[40%]">
          <p className="pb-2 font-bold text-md">Start Date</p>
          <input id={`start_date_id_${id}`} className="outline-none p-[5px] w-full focus:shadow-md focus:shadow-gray-900" type='date' />
        </div>
         <div className="pl-[30px] pt-[20px] w-[40%]">
          <p className="pb-2 font-bold text-md">End Date</p>
          <input id={`end_date_id_${id}`} className="outline-none p-[5px] w-full focus:shadow-md focus:shadow-gray-900" type='date' />
        </div>
         {ky>=1&&<div className="pl-[20px] pt-[30px] w-fit">
          <p onClick={() => handleDatesRemoval(id)} className='m-[30px] cursor-pointer border border-zinc-950 h-fit pl-4 pr-4 relative hover:text-white hover:bg-black hover:shadow-md hover:shadow-gray-900'>Remove</p>
         </div>}
      </div>
      ))} */}
        <div className="pl-[30px] pt-[20px] w-fit">
          <p onClick={() => addDate()} className='m-[10px] cursor-pointer border border-zinc-950 h-fit pl-4 pr-4 relative hover:text-white hover:bg-black hover:shadow-md hover:shadow-gray-900'>Add Date</p>
         </div>
      
      {/* Assignee */}
      <div className="flex justify-start">
        <div className="pl-[30px] pt-[20px] w-[30%]">
        <p className="pb-2 font-bold text-md">Assignee</p>
        <select id={assigneeId} value={assigneesSelected} onChange={e => setAssigneesSelected(e.target.value)} className="outline-none p-[5px] w-full focus:shadow-md focus:shadow-gray-900">
          {users.map((user:any,ky:any) => (
            <option key={ky} value={user.id}>{user.first_name} {user.last_name}</option>
          ))}
        </select>
      </div>
      <div className="pl-[20px] pt-[25px] w-fit">
          <p onClick={() => setAssigneeForm(!assigneeForm)} className='m-[30px] cursor-pointer border border-zinc-950 h-fit pl-4 pr-4 relative hover:text-white hover:bg-black hover:shadow-md hover:shadow-gray-900'>Create Assignee</p>
         </div>
      </div>

        {/* add assignee form */}
       {assigneeForm&&
        <div className="flex pb-2">
          <div className="pl-[30px] flex justify-between">
          <p className="pb-2 font-bold text-md">Email</p>
          <input className="outline-none ml-[5px] p-[5px] w-[200px] focus:shadow-md focus:shadow-gray-900" type='email' value={emailA} onChange={e => setEmailA(e.target.value)} placeholder="email" />
        </div>
        <div className="pl-[30px] flex justify-between">
          <p className="pb-2 font-bold text-md">First Name</p>
          <input className="outline-none ml-[5px] p-[5px]  w-[200px] focus:shadow-md focus:shadow-gray-900" type='text' value={firstNameA} onChange={e => setFirstNameA(e.target.value)} placeholder="first name" />
        </div>
        <div className="pl-[30px] flex justify-between">
          <p className="pb-2 font-bold text-md">Last Name</p>
          <input className="outline-none ml-[5px]  p-[5px] w-[200px] focus:shadow-md focus:shadow-gray-900" type='text' value={lastNameA} onChange={e => setLastNameA(e.target.value)} placeholder="last name" />
        </div>
        <p onClick={() => setAssigneeForm(false)} className='m-[10px] cursor-pointer border border-zinc-950 h-fit pl-4 pr-4 relative hover:text-white hover:bg-black hover:shadow-md hover:shadow-gray-900'>Save</p>
         
        </div>}


        {/* Collaborators */}
      <div className="flex justify-start">
        <div className="pl-[30px] pt-[20px] w-[30%]">
        <p className="pb-2 font-bold text-md">Collaborator</p>
        <select id={collaboratorId} value={selectedCollaborator} onChange={e => setSelectedCollaborator(e.target.value)} className="outline-none p-[5px] w-full focus:shadow-md focus:shadow-gray-900">
          {users.map((user:any,ky:any) => (
            <option key={ky} value={user.id}>{user.first_name} {user.last_name}</option>
          ))}
        </select>
      </div>
      <div className="flex pl-[20px] pt-[25px] w-fit">
          <p onClick={() => {
            handleCollaborators()

          }} className='m-[30px] cursor-pointer border border-zinc-950 h-fit pl-4 pr-4 relative hover:text-white hover:bg-black hover:shadow-md hover:shadow-gray-900'>Add Collaborator</p>
         <p onClick={() => setCollaboratorForm(!collaboratorForm)} className='m-[30px] cursor-pointer border border-zinc-950 h-fit pl-4 pr-4 relative hover:text-white hover:bg-black hover:shadow-md hover:shadow-gray-900'>Create Collaborator</p>
          </div>
      </div>

        {/* add collaborator form */}
       {collaboratorForm&&
        <div className="flex pb-2">
          <div className="pl-[30px] flex justify-between">
          <p className="pb-2 font-bold text-md">Email</p>
          <input className="outline-none ml-[5px] p-[5px] w-[200px] focus:shadow-md focus:shadow-gray-900" type='email' value={emailC} onChange={e => setEmailC(e.target.value)} placeholder="email" />
        </div>
        <div className="pl-[30px] flex justify-between">
          <p className="pb-2 font-bold text-md">First Name</p>
          <input className="outline-none ml-[5px] p-[5px]  w-[200px] focus:shadow-md focus:shadow-gray-900" type='text' value={firstNameC} onChange={e => setFirstNameC(e.target.value)} placeholder="first name" />
        </div>
        <div className="pl-[30px] flex justify-between">
          <p className="pb-2 font-bold text-md">Last Name</p>
          <input className="outline-none ml-[5px]  p-[5px] w-[200px] focus:shadow-md focus:shadow-gray-900" type='text' value={lastNameC} onChange={e => setLastNameC(e.target.value)} placeholder="last name" />
        </div>
        <p onClick={() => setCollaboratorForm(false)} className='m-[10px] cursor-pointer border border-zinc-950 h-fit pl-4 pr-4 relative hover:text-white hover:bg-black hover:shadow-md hover:shadow-gray-900'>Save</p>
         
        </div>}
       <div  className="pl-[30px] flex justify-start">
{collaborators.map((collab, ky) => (
          collab.length>1&&<p className="p-2 mr-3 font-bold text-md bg-black text-white rounded-md text-center"  key={ky}>{collab}</p>
        ))}
        </div>
        
        

              {/* Projects */}
      <div className="flex justify-start">
        <div className="pl-[30px] pt-[20px] w-[30%]">
        <p className="pb-2 font-bold text-md">Projects</p>
        <select value={projectVal} onChange={e => setProjectVal(e.target.value)} className="outline-none p-[5px] w-full focus:shadow-md focus:shadow-gray-900">
          {projectsData.map((projectData:any,ky) => (
            <option key={ky} value={projectData.id}>{projectData.name}</option>
          ))}
        </select>
      </div>
      <div className="pl-[20px] pt-[25px] w-fit">
          <p onClick={() => setProjectForm(!projectForm)} className='m-[30px] cursor-pointer border border-zinc-950 h-fit pl-4 pr-4 relative hover:text-white hover:bg-black hover:shadow-md hover:shadow-gray-900'>Create Project</p>
         </div>
      </div>

        {/* add project form */}
       {projectForm&&
        <div className="flex pb-2">
          
        <div className="pl-[30px] flex justify-between">
          <p className="pb-2 font-bold text-md">Name</p>
          <input className="outline-none ml-[5px] p-[5px]  w-[200px] focus:shadow-md focus:shadow-gray-900" type='text' value={projectName} onChange={e => setProjectName(e.target.value)} placeholder="project name" />
        </div>
        <div className="pl-[30px] flex justify-between">
          <p className="pb-2 font-bold text-md">Short Description</p>
          <input className="outline-none ml-[5px]  p-[5px] w-[500px] focus:shadow-md focus:shadow-gray-900" type='text' value={projectDescription} onChange={e => setProjectDescription(e.target.value)} placeholder="short description" />
        </div>
        <p onClick={() => setProjectForm(false)} className='m-[10px] cursor-pointer border border-zinc-950 h-fit pl-4 pr-4 relative hover:text-white hover:bg-black hover:shadow-md hover:shadow-gray-900'>Save</p>
         
        </div>}


      {/* task description field */}
      <div className="pl-[30px] pt-[30px]">
        <p className="pb-2 font-bold text-md">Task Description <span>{100 - taskDescription.length}</span> charaters remaining</p>
        <textarea onKeyUp={e => {
         let remChars = 100 - taskDescription.length
         if(remChars>0) {
          setCharacterLimit(false)
         }else {
          setCharacterLimit(true)
         }
        }} className={
          characterLimit?
          "outline-none p-[5px] w-[80%] h-[100px] border-2 border-red-500 focus:shadow-md focus:shadow-gray-900":
          "outline-none p-[5px] w-[80%] h-[100px] border-2 border-green-600 focus:shadow-md focus:shadow-gray-900"
        } value={taskDescription} onChange={e => setTaskDescription(e.target.value)} placeholder="Task Description"></textarea>
      </div>

      {/* priority */}

      <div className="pl-[30px] pt-[30px]">
        <p className="pb-2 font-bold text-md">Priority</p>
        <div className="flex justify-around">
          <p className={currentPriority==="low"?
          'm-[30px] cursor-pointer border border-zinc-950 h-fit p-5 relative text-white bg-black shadow-md shadow-gray-900':
          'm-[30px] cursor-pointer border border-zinc-950 h-fit p-5 relative hover:text-white hover:bg-black hover:shadow-md hover:shadow-gray-900'  
        } onClick={() => setCurrentPriority('low')}>Low</p>
          <p  className={currentPriority==="normal"?
          'm-[30px] cursor-pointer border border-zinc-950 h-fit p-5 relative text-white bg-black shadow-md shadow-gray-900':
          'm-[30px] cursor-pointer border border-zinc-950 h-fit p-5 relative hover:text-white hover:bg-black hover:shadow-md hover:shadow-gray-900'  
        } onClick={() => setCurrentPriority('normal')}>Normal</p>
          <p  className={currentPriority==="high"?
          'm-[30px] cursor-pointer border border-zinc-950 h-fit p-5 relative text-white bg-black shadow-md shadow-gray-900':
          'm-[30px] cursor-pointer border border-zinc-950 h-fit p-5 relative hover:text-white hover:bg-black hover:shadow-md hover:shadow-gray-900'  
        } onClick={() => setCurrentPriority('high')}>High</p>
        </div>
      </div>
{error && <p>{ error.status }</p>}

         <p className='m-[30px] cursor-pointer border border-zinc-950 h-fit p-4 relative hover:text-white hover:bg-black hover:shadow-md hover:shadow-gray-900'>{info.length} files</p>
         {info.length>=1 && info.map((i:any,k:any) => (
          <Link className='m-[30px] cursor-pointer border border-zinc-950 h-fit p-4 relative hover:text-white hover:bg-black hover:shadow-md hover:shadow-gray-900' target="_blank"  href={i} key={k}>File {k+1}</Link>
         ))}
        <div className='w-full h-[70px] flex justify-between'>
        {/* <p onClick={} className='m-[30px] cursor-pointer border border-zinc-950 h-fit p-4 relative hover:text-white hover:bg-black hover:shadow-md hover:shadow-gray-900'>Attach</p> */}
        

        <CldUploadWidget uploadPreset="bhvm3nzv" onUpload={handleClickUploadImage}>
            {({ open }) => {
              function handleOnClick(e: any) {
                e.preventDefault();
                open();
              }
              return (
                <button className='m-[30px] cursor-pointer border border-zinc-950 h-fit p-4 relative hover:text-white hover:bg-black hover:shadow-md hover:shadow-gray-900' onClick={handleOnClick}>
                  Attach File
                </button>
              )
            }}
          </CldUploadWidget>

          
        
        <div className='flex'>
          <Link href={'/alltasks'} className='mt-[40px] ml-[40px] cursor-pointer border border-zinc-950 h-fit pl-4 pr-4 relative hover:text-white hover:bg-black hover:shadow-md hover:shadow-gray-900'>Go Back</Link>
          <p onClick={handleTask} className='mt-[40px] ml-[40px] cursor-pointer border border-zinc-950 h-fit pl-4 pr-4 relative hover:text-white hover:bg-black hover:shadow-md hover:shadow-gray-900'>Update</p>
        </div>
      </div>
    </div>
  )
}
