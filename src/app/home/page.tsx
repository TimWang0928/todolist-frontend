"use client";
import { useEffect, useState } from "react"
import DialogComponent from "../components/dialog"
import { Button, Drawer, MenuItem, Select, TextField } from "@mui/material"
import { fetcher } from "../utils/request";
import { SelectChangeEvent, SelectInputProps } from "@mui/material/Select/SelectInput";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Grid from '@mui/material/Grid2';
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsIcon from '@mui/icons-material/Settings';
import { blue } from '@mui/material/colors';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import toast, { Toaster } from 'react-hot-toast';

type dialogStatus = 1 | 2 | 3 | 4 // 1:add task 2:add status 3:update task 4:update status
type taskInfo = {
    _id?: string,
    taskName: string,
    status: string,
    deadline: string
}
type statusInfo = {
    _id?: string,
    name: string,
    color: string,
}
type getStatusInfo = {
    _id: string,
    name: string,
    color: string,
    createdAt: string,
    updatedAt: string,
}
type statusList = getStatusInfo[]
type getTaskListInfo = {
    _id: string,
    taskName: string,
    status: getStatusInfo,
    deadline: Date,
    createdAt: string,
    updatedAt: string,
}
type taskList = getTaskListInfo[]

const HomePage: React.FC = () => {
    const [open, setOpen] = useState<boolean>(false)
    const [drawerOpen, setDrawerOpen] = useState<boolean>(false)
    const [dialogStatus, setDialogStatus] = useState<dialogStatus>(1)
    const [statusList, setStatusList] = useState<statusList>()
    const [userName, setUserName] = useState<any>('')

    const [taskInfo, setTaskInfo] = useState<taskInfo>({
        _id: '',
        taskName: '',
        status: '',
        deadline: '',
    })

    const [statusInfo, setStatusInfo] = useState<statusInfo>({
        _id: '',
        name: '',
        color: '#000000',
    })

    const [taskList, setTaskList] = useState<taskList>()

    useEffect(() => {
        setUserName(localStorage.getItem('userName'))
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            // const result: taskList = (await fetcher<taskList>('todo/get', 'get', { userId: localStorage.getItem('userId') })).data
            // setTaskList(result)
            getTaskListData()
        }
        if (!open) {
            fetchData()
        }
    }, [open]);

    const openDialog = async (status: dialogStatus) => {
        setTaskInfo({
            taskName: '',
            status: '',
            deadline: '',
        })
        setStatusInfo({
            name: '',
            color: '#000000',
        })
        if (status === 1 || status === 3) {
            const result: statusList = await (await fetcher<statusList>('todo/status/get', 'get', { userId: localStorage.getItem('userId') })).data
            setStatusList(result)
        }
        setOpen(true)
        setDialogStatus(status)
    }

    const closeDialog = () => {
        setOpen(false)
    }

    const submit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const formJson = Object.fromEntries((formData as any).entries());
        if (dialogStatus === 1) {
            const result = await fetcher<any>('todo/add', 'post', {
                taskName: taskInfo.taskName,
                status: taskInfo.status,
                deadline: new Date(taskInfo.deadline),
                userId: localStorage.getItem('userId'),
            })
        } else if (dialogStatus === 2) {
            const result = await fetcher<any>('todo/status/add', 'post', {
                name: statusInfo.name,
                color: statusInfo.color,
                userId: localStorage.getItem('userId'),
            })
            controlDrawer(true)
        } else if (dialogStatus === 3) {
            const result = await fetcher<any>('todo/update/' + taskInfo._id, 'put', {
                taskName: taskInfo.taskName,
                status: taskInfo.status,
                deadline: new Date(taskInfo.deadline),
            })
        } else {
            const result = await fetcher<any>('todo/status/update/' + statusInfo._id, 'put', {
                name: statusInfo.name,
                color: statusInfo.color,
            })
            controlDrawer(true)
        }
        setOpen(false)
    }

    const colorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setStatusInfo((prev: any) => {
            if (!prev) return undefined;
            return {
                ...prev,
                color: event.target.value,
            };
        });

        console.log(statusInfo)
    }

    const statusNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setStatusInfo((prev: any) => {
            if (!prev) return undefined;
            return {
                ...prev,
                name: event.target.value,
            };
        });
    }

    const statusSelectChange = (event: SelectChangeEvent<any>) => {
        setTaskInfo((prev: any) => {
            if (!prev) return undefined;
            return {
                ...prev,
                status: event.target.value,
            };
        });
    }

    const taskNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTaskInfo((prev: any) => {
            if (!prev) return undefined;
            return {
                ...prev,
                taskName: event.target.value,
            };
        });
    }

    const deadlineChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTaskInfo((prev: any) => {
            if (!prev) return undefined;
            return {
                ...prev,
                deadline: event.target.value,
            };
        });
    }

    const deleteTask = async (taskId: string) => {
        const deleteTask = await fetcher<any>('todo/delete/' + taskId, 'delete')
        // const result: taskList = (await fetcher<taskList>('todo/get', 'get', { userId: localStorage.getItem('userId') })).data
        // setTaskList(result)
        getTaskListData()
    }

    const changeTask = async (taskId: string) => {
        openDialog(3)

        const result: taskList = (await fetcher<taskList>('todo/get', 'get', { _id: taskId })).data

        setTaskInfo((prev: any) => {
            if (!prev) return undefined;
            return {
                ...prev,
                _id: taskId,
                taskName: result[0].taskName,
                status: result[0].status ? result[0].status?._id : '',
                deadline: result[0].deadline.toString().split('T')[0],
            };
        });
    }

    const controlDrawer = async (status: boolean) => {
        setDrawerOpen(status)
        if (status) {
            const result: statusList = await (await fetcher<statusList>('todo/status/get', 'get', { userId: localStorage.getItem('userId') })).data
            setStatusList(result)
        }
    }

    const deleteStatus = async (statusId: string) => {
        await fetcher<any>('todo/status/delete/' + statusId, 'delete')
        const result: statusList = await (await fetcher<statusList>('todo/status/get', 'get', { userId: localStorage.getItem('userId') })).data
        setStatusList(result)
        getTaskListData()
    }

    const changeUpdate = async (statusId: string) => {
        // controlDrawer(false)
        openDialog(4)
        const result: statusList = (await fetcher<statusList>('todo/status/get', 'get', { _id: statusId })).data

        setStatusInfo((prev: any) => {
            if (!prev) return undefined;
            return {
                ...prev,
                _id: statusId,
                name: result[0].name,
                color: result[0].color
            };
        });
    }

    const getTaskListData = async () => {
        const result: taskList = (await fetcher<taskList>('todo/get', 'get', { userId: localStorage.getItem('userId') })).data
        setTaskList(result)
    }

    return (
        <div>
            <header className="h-[50px] border-b border-gray-400 bg-gray-50 flex items-center justify-between pr-8 pl-8">
                <div className="todo-logo">TODO</div>
                <div className=" flex items-center">
                    <div className="mr-2 text-xl">{userName}</div>
                    <AccountCircleIcon className="h-[40px] w-[40px]" />
                </div>
            </header>
            <div className="w-full h-[calc(100vh-50px)] overflow-auto ">
                <div className="h-16 flex justify-end items-center pl-4 pr-4">
                    <Button variant="contained" onClick={() => { openDialog(1) }} className="mr-4">Add task</Button>
                    <Button variant="contained" onClick={() => { controlDrawer(true) }}>Status</Button>
                </div>

                <Grid container spacing={4} className="w-full overflow-auto pl-4 pr-4">
                    {
                        taskList?.map((v, i) => {
                            return <Grid
                                key={i}
                                // style={{
                                //     backgroundColor: v.status.color,

                                // }}
                                className="h-[120px] flex bg-gray-200" size={4}>
                                <div className="h-[120px] w-[30px]" style={{ backgroundColor: v.status?.color }}></div>
                                <div className="flex justify-between w-full p-3">
                                    <div className="flex flex-col justify-between font-bold ">
                                        <div style={{ color: '#1976d2' }} className="text-xl">{v.taskName}</div>
                                        <div>
                                            <span style={{ color: '#1976d2' }}>status: </span>
                                            {v.status ? v.status.name : 'none'}
                                        </div>
                                        <div>
                                            <span style={{ color: '#1976d2' }}>deadline: </span>
                                            {v.deadline?.toString().split('T')[0]}</div>
                                    </div>
                                    <div className="flex flex-col justify-around items-center">
                                        <SettingsIcon sx={{ color: blue[700] }} onClick={() => { changeTask(v._id) }}></SettingsIcon>
                                        <DeleteIcon sx={{ color: blue[700] }} onClick={() => { deleteTask(v._id) }}></DeleteIcon>
                                    </div>
                                </div>
                            </Grid>
                        })
                    }
                </Grid>

                <DialogComponent
                    isOpen={open}
                    onClose={closeDialog}
                    title={dialogStatus === 1 || dialogStatus === 3 ? 'Task' : 'Status'}
                    content={
                        <form
                            onSubmit={submit}
                        >
                            {dialogStatus === 1 || dialogStatus === 3 ?
                                <div>
                                    <FormControl variant="outlined" fullWidth>
                                        <TextField
                                            required
                                            id="taskName"
                                            name="taskName"
                                            type="text"
                                            margin="dense"
                                            label="TaskName"
                                            fullWidth
                                            value={taskInfo.taskName}
                                            onChange={taskNameChange}
                                        />
                                    </FormControl>
                                    <FormControl variant="outlined" fullWidth>
                                        <InputLabel required id="selectStatus">Status</InputLabel>
                                        <Select
                                            required
                                            labelId="selectStatus"
                                            id="selectStatus"
                                            value={taskInfo.status}
                                            label="Status"
                                            onChange={statusSelectChange}
                                        >
                                            {
                                                statusList?.map((value, index) => {
                                                    return <MenuItem key={index} value={value._id}>{value.name}</MenuItem>
                                                })
                                            }
                                        </Select>
                                    </FormControl>
                                    <input
                                        required
                                        type="date"
                                        value={taskInfo.deadline}
                                        onChange={deadlineChange}
                                    ></input>
                                </div>
                                :
                                <div>
                                    <FormControl>
                                        <TextField
                                            required
                                            id="statusName"
                                            name="statusName"
                                            type="text"
                                            // variant="outlined"
                                            margin="dense"
                                            label="statusName"
                                            fullWidth
                                            value={statusInfo.name}
                                            onChange={statusNameChange}
                                        />
                                        <input
                                            name="color"
                                            type="color"
                                            value={statusInfo.color}
                                            onChange={colorChange}></input>
                                    </FormControl>
                                </div>
                            }
                            <Button onClick={closeDialog}>CANCEL</Button>
                            <Button type="submit">SUBMIT</Button>
                        </form>
                    }
                ></DialogComponent>

                <Drawer
                    open={drawerOpen}
                    onClose={() => { controlDrawer(false) }}
                    anchor={'right'}>
                    <div className="w-[400px] p-3">
                        <Button variant="contained" onClick={() => { openDialog(2) }}>Add status</Button>
                        {
                            statusList?.map((v, i) => {
                                return <div key={i} className="bg-gray-100 mt-4 rounded p-3 flex justify-between items-center">
                                    <div>
                                        <div>
                                            <span style={{ color: '#1976d2' }}>status: </span>
                                            {v.name}
                                        </div>
                                        <div className="flex items-center">
                                            <span style={{ color: '#1976d2' }}>color: </span>
                                            <div style={{ backgroundColor: v.color }} className="w-[40px] h-[16px] ml-3"></div>
                                        </div>
                                    </div>
                                    <div>
                                        <SettingsIcon sx={{ color: blue[700] }} onClick={() => { changeUpdate(v._id) }}></SettingsIcon>
                                        <DeleteIcon sx={{ color: blue[700] }} onClick={() => { deleteStatus(v._id) }} className="ml-3"></DeleteIcon>
                                    </div>
                                    {/* <Button onClick={() => { changeUpdate(v._id) }}>update</Button> */}
                                    {/* <Button onClick={() => { deleteStatus(v._id) }}>delete</Button> */}
                                </div>
                            })
                        }
                    </div>
                </Drawer>

                <Toaster />
            </div >
        </div >
    )

}

export default HomePage