import {useState,useEffect} from 'react';
import {v4 as uuidv4} from 'uuid'

import "./App.css";

import TaskForm from './components/TaskForm'
import Controls from './components/Controls'
import TaskList from './components/TaskList'

function App() {
  let [tasks,setTasks] = useState([])
  const [isDisplayForm, setIsDisplayForm] = useState(false)
  const [taskEditing, setTaskEditing] = useState(null)
  const [filter,setFilter] = useState({
    name: '',
    status:-1
  })

  // componentWillMount set List nếu đã có
  useEffect(() => {
    if(sessionStorage && sessionStorage.getItem('tasks')){
      const tasks = JSON.parse(sessionStorage.getItem('tasks'))
      setTasks(tasks)
    }
  },[])

  // Setstate list frist time
  const onGenerateData = () => {
    const  tasks = [
      {
        id: uuidv4(),
        name: 'Học lập trình',
        status: true
      },
      {
        id: uuidv4(),
        name: 'Đi bơi',
        status: false
      },
      {
        id: uuidv4(),
        name: 'Ngủ',
        status: true
      },
    ];
    
    setTasks(tasks)
    sessionStorage.setItem('tasks', JSON.stringify(tasks))
  }

  // Submit add
  const onSubmit = (name,status,id) => {
    const  newTaskList = [...tasks]

    // Thêm công việc
    if(id === '') {
      const  newTask = {
        id: uuidv4(),
        name,
        status
      }

      newTaskList.push(newTask)
    }
    // Cập nhập công việc
    else {
      const indexUpdate = tasks.findIndex(task => task.id === id)
      const  newTask = {
        id,
        name,
        status
      }

      newTaskList[indexUpdate] = newTask
      setTaskEditing(null)
    }

    setTasks(newTaskList)
    sessionStorage.setItem('tasks', JSON.stringify(newTaskList))
  }

  // Đóng mở Component Form
  const onToggleForm = () => {
    // Khi đang hiện Form thêm công việc thì bấm vào nút không cho đóng
    if(isDisplayForm && taskEditing === null) {
      setIsDisplayForm(true)
      setTaskEditing(null)
    }
    else {
      setIsDisplayForm(!isDisplayForm)
      setTaskEditing(null)
    }
  }

  // Đóng Component Form khi X
  const onCloseForm = () => {
    setIsDisplayForm(false)
  }

  // Mở Component Form
  const onShowForm = () => {
    setIsDisplayForm(true)
  }

  // Update Status
  const onUpdateStatus = (id) => {
    // dùng cách tạo task mới có tất cả phần tử ban đầu với status thay đổi mới
    const newTask = tasks.map((task) => {
      if(task.id === id) {
        return {...task,status:!task.status}
      }
      else {
        return task
      }
    })

    // Nếu newTask có tồn tại (#null và #underfined)
    if(newTask) {
      setTasks(newTask)
      sessionStorage.setItem('tasks', JSON.stringify(newTask))
    }
  }

  // Delete Task
  const onDeleteTask = (id) => {
    const indexDelete = tasks.findIndex(task => task.id === id)

    if(indexDelete < 0) return
    else {
      const newTaskList = [...tasks]
      newTaskList.splice(indexDelete,1)

      setTasks(newTaskList)
      sessionStorage.setItem('tasks', JSON.stringify(newTaskList))
    }
  }

  // Update Task: tạo ra 1 state để lưu giá trị của task cần thay đổi, truyền state
  // này xuống kèm theo đầy đủ yếu tố và sau đó cập nhập lại state con và
  // truyền id ngược lên
  const onUpdateTask = (id) => {
    const taskUpdate = tasks.find(task => task.id === id)

    if(taskUpdate){
      setTaskEditing(taskUpdate)
      onShowForm()
    }
  }

  // Filter
  const onFilter = (filterName,filterStatus) => {
    setFilter({
      name: filterName.toLowerCase(),
      status:filterStatus
    })
  }

  if(filter) {
    // Filter Input
    if(filter.name) {
      tasks = tasks.filter(task => task.name.toLowerCase().indexOf(filter.name) !== -1) 
    }
    // Filter Select
    tasks = tasks.filter(task => {
      if(filter.status === -1) {
        return task
      }
      else {
        return task.status === (filter.status === 1 ? true : false)
      }
    })
  }

  return (
    <div className="container">
      <div className="text-center">
        <h1>Quản lý công việc</h1>
        <hr></hr>
      </div>

      <div className="row">
        <div className={isDisplayForm ? "col-xs-4 col-sm-4 col-md-4 col-lg-4" : ''}>
          {/* Form */}
            {isDisplayForm ? <TaskForm onCloseForm={onCloseForm} 
            onSubmit={onSubmit} taskEditing={taskEditing} /> : ''}
        </div>

        <div className={isDisplayForm ? "col-xs-8 col-sm-8 col-md-8 col-lg-8" :
      'col-xs-12 col-sm-12 col-md-12 col-lg-12'}>
          <button className="btn btn-primary" onClick={onToggleForm} >
            <span className="fa fa-plus mr-5"></span>Thêm công việc
          </button>
          <button className="btn btn-danger ml-5" onClick={onGenerateData}>
            Generate Data
          </button>

          {/* Search - Sort */}
            <Controls />

            {/* List */}
            <div className="row mt-3">
              <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <TaskList
                tasks={tasks} onUpdateStatus={onUpdateStatus} onDeleteTask={onDeleteTask} 
                onUpdateTask={onUpdateTask} onFilter={onFilter} />
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}

export default App;