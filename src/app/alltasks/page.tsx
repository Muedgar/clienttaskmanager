'use client'

import Link from "next/link"
import React, { useEffect, useId, useState } from "react"
import {utils, writeFile} from "xlsx"
// import CreateTask from "./createtask/page"


export default function AllTasks() {

  const [tasks, setTasks] = useState([])
  const logoutIdLink = useId()
  let getDataOne = "once"

  useEffect(() => {
    async function getData() {
      await fetch("http://localhost:3004/task")
        .then(d=>d.json())
        .then(d=>setTasks(d))
        .catch(e=>console.log(e))
    }
    getData()
  }, [getDataOne])


  const [currentPage, setCurrentPage] = useState(1)
  const recordsPerPage = 2
  const lastIndex = currentPage * recordsPerPage
  const firstIndex = lastIndex - recordsPerPage
  const records = tasks.slice(firstIndex,lastIndex)
  const npage = Math.ceil(tasks.length/recordsPerPage)
  const numbers:number[] = getNumbers()

  function getNumbers() {
    // [...Array(npage+1).keys()].slice(1)
    let arr = []
    for(let i=0;i<npage;i++) {
      arr.push(i+1)
    }
    return arr
  }

  // console.log("recordsPerPage ",recordsPerPage, "lastIndex  ", lastIndex, "firstIndex", firstIndex, "records  ", records, "npage  ", npage, "numbers  ", numbers)
  
  //  name
  const [name, setName] = useState('')
  // dates
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  return (
    <>
      <div className='w-[80%] h-fit scroll-auto bg-orange-200 m-auto pb-[30px]'>
      <div className='w-full h-[70px] flex justify-between'>
        <h1 className='m-[30px] font-bold text-lg'>All Tasks</h1>
        <div className='flex'>
          <Link href={'/createtask'} className='m-[30px] cursor-pointer border border-zinc-950 h-fit pl-4 pr-4 relative hover:text-white hover:bg-black hover:shadow-md hover:shadow-gray-900'>Create New Task</Link>
          <Link id={logoutIdLink} href={'/'} className="hidden"></Link>
          <p onClick={() => ExportData()} className='m-[30px] cursor-pointer border border-zinc-950 h-fit pl-4 pr-4 relative hover:text-white hover:bg-black hover:shadow-md hover:shadow-gray-900'>Download Excel Report</p>
          <p onClick={() => {
            localStorage.removeItem('loggedInUser')
            document.getElementById(logoutIdLink)?.click()
          }} className='m-[30px] cursor-pointer border border-zinc-950 h-fit pl-4 pr-4 relative hover:text-white hover:bg-black hover:shadow-md hover:shadow-gray-900'>Logout</p>
        </div>
      </div>
      <div>
        <div className="flex justify-start">
          <input onKeyUp={handleSearchByName} value={name} onChange={e => setName(e.target.value)} className="outline-none p-[5px] w-[350px] ml-[30px] focus:shadow-md focus:shadow-gray-900" type='text' placeholder="Search by task name" />
        <p onClick={() => createdLastComesFirst()} className='m-[10px] text-xs cursor-pointer border border-zinc-950 h-fit pl-4 pr-4 relative hover:text-white hover:bg-black hover:shadow-md hover:shadow-gray-900'>Created Last Comes First</p>
        <p onClick={() => createdLastComesLast()} className='m-[10px] text-xs cursor-pointer border border-zinc-950 h-fit pl-4 pr-4 relative hover:text-white hover:bg-black hover:shadow-md hover:shadow-gray-900'>Created Last Comes Last</p>
        
        </div>
      <div className="flex justify-start">
         <div className="pl-[30px] pt-[20px] w-[30%]">
          <p className="pb-2 font-bold text-md">Start Date</p>
          <input value={startDate} onChange={e => setStartDate(e.target.value)} className="outline-none p-[5px] w-full focus:shadow-md focus:shadow-gray-900" type='date' />
        </div>
         <div className="pl-[30px] pt-[20px] w-[30%]">
          <p className="pb-2 font-bold text-md">End Date</p>
          <input value={endDate} onChange={e => setEndDate(e.target.value)} className="outline-none p-[5px] w-full focus:shadow-md focus:shadow-gray-900" type='date' />
        </div>
        <div className="pl-[30px] pt-[20px] w-[40%]">
          <p onClick={() => searchByDate()} className='m-[30px] text-xs cursor-pointer border border-zinc-950 h-fit pl-4 pr-4 relative hover:text-white hover:bg-black hover:shadow-md hover:shadow-gray-900'>Get Tasks Than Must Be Completed During This Period</p>
        </div>
      </div>
      </div>

      {/* all tasks */}
      <div className="w-full h-fit mt-[10px]">
        {records?.map((task:any,ky:any)=>(
          <div key={ky} className="flex border-b-[1px] border-gray-700 justify-between w-[90%] m-auto bg-orange-400 hover:bg-orange-300 p-5 cursor-pointer">
        <div className="">
          <p className="m-1 font-serif text-emerald-900 font-bold text-lg">{task.name}</p>
          <p className="m-1 font-serif text-black font-bold text-md">Assigned to: <span className="bg-black text-white text-sm rounded-md p-1 m-1">{task.assignees[0]}</span></p>
          <p className="m-1 font-serif text-black font-bold text-md">Collaborators: 
          {task.collaborators?.map((collaborator:any,k:any)=>(
            <span key={k} className="bg-black text-white text-sm rounded-md p-1 m-1">{collaborator}</span>
          ))}
          </p>
        </div>
        <div className='flex'>
          <Link onClick={() => {
            localStorage.setItem('currentview', task.id)
          }} href={'/viewtask/'}  className='m-[30px] cursor-pointer border border-zinc-950 h-fit pl-4 pr-4 relative hover:text-white hover:bg-black hover:shadow-md hover:shadow-gray-900'>View</Link>
          <p onClick={() => handleDelete(task.id)} className='m-[30px] cursor-pointer border bg-red-500 border-zinc-950 h-fit pl-4 pr-4 relative hover:text-white hover:bg-red-700 hover:shadow-md hover:shadow-gray-900'>Delete</p>
        </div>
      </div>
        ))}
      
      </div>
      <div className="w-full h-fit">
        <div className="flex border-b-[1px] justify-center w-[90%] pt-[10px] m-auto  p-1 cursor-pointer">
            <p onClick={prevPage} className='m-[30px] cursor-pointer border border-zinc-950 h-fit pl-4 pr-4 relative hover:text-white hover:bg-black hover:shadow-md hover:shadow-gray-900'>Prev</p>
           { 
            numbers.map((n:number,i:any) => (
              <p onClick={() => changeCPage(n)} key={i} className={
                currentPage===n?
                'mt-[30px] cursor-pointer border border-zinc-950 bg-black h-fit pl-4 pr-4 relative text-white hover:text-black hover:bg-white hover:border-black hover:shadow-md hover:shadow-gray-900'
                :
                'mt-[30px] cursor-pointer border border-zinc-950 h-fit pl-4 pr-4 relative hover:text-white hover:bg-black hover:shadow-md hover:shadow-gray-900'
              }>{n}</p>
            ))
           }
          
            <p onClick={nextPage} className='m-[30px] cursor-pointer border border-zinc-950 h-fit pl-4 pr-4 relative hover:text-white hover:bg-black hover:shadow-md hover:shadow-gray-900'>Next</p>
          
       </div>
      </div>
      </div>
    </>
  )

  function prevPage() {
    if(currentPage !== 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  function changeCPage(id:number) {
    setCurrentPage(id)
  }

  function nextPage() {
    if(currentPage !== npage) {
      setCurrentPage(currentPage + 1)
    }
  }
  function handleSearchByName(e:any) {
    // listen for enter key
    async function getData() {
    if(name) {
await fetch("http://localhost:3004/task/search/"+name)
        .then(d=>d.json())
        .then(d=>setTasks(d))
        .catch(e=>console.log(e))

    }else {
await fetch("http://localhost:3004/task")
        .then(d=>d.json())
        .then(d=>setTasks(d))
        .catch(e=>console.log(e))
    }
    
    }
    if(e.code === "Enter") {
      getData()
    }

  }

  async function searchByDate() {
    if(startDate && endDate) {
      await fetch("http://localhost:3004/task/bydate/"+startDate+"/"+endDate)
        .then(d=>d.json())
        .then(d=> {
          if(d) {
            setTasks(d)
          }
        })
        .catch(e=>console.log(e))
    }
  }

  async function createdLastComesFirst() {
  await fetch("http://localhost:3004/task")
        .then(d=>d.json())
        .then(d=>setTasks(d.reverse()))
        .catch(e=>console.log(e))
  }
  async function createdLastComesLast() {
await fetch("http://localhost:3004/task")
        .then(d=>d.json())
        .then(d=>setTasks(d))
        .catch(e=>console.log(e))
  }

  async function ExportData()
    {
      async function getData() {
        let data:any = []
        await fetch("http://localhost:3004/task")
        .then(d=>d.json())
        .then(d=>{
          for(let i=0;i<d.length;i++) {
            d[i].task_duration = d[i].task_duration.toString()
            d[i].assignees = d[i].assignees.toString()
            d[i].collaborators = d[i].collaborators.toString()
            d[i].project_id = d[i].project_id.id
            d[i].attached = d[i].attached.toString()
            data.push(d[i])
          }
        })
        .catch(e=>console.log(e))
        return data
      }
      let filename='tasks_reports.xlsx';
       let data:any = await getData()
       var ws = utils.json_to_sheet(data);
        var wb = utils.book_new();
        utils.book_append_sheet(wb, ws, "Tasks");
        writeFile(wb,filename)
     }

     function handleDelete(id: string) {
      async function del(key:string) {
         await fetch("http://localhost:3004/task/"+key, {
    method: "DELETE",
    mode: "cors", 
    cache: "no-cache", 
    credentials: "include", 
    headers: {
      "Content-Type": "application/json",
    }
  }).then(d => d.json())
  .then(d => {
    alert("Successfully deleted task")
  })
      }

    del(id)

    createdLastComesLast()
     }
}
