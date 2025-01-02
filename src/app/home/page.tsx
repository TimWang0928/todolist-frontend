"use client";
import { useEffect, useState } from "react"
import DialogComponent from "../components/dialog"
import { Button, Drawer, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material"
import { fetcher } from "../utils/request";
import { SelectChangeEvent, SelectInputProps } from "@mui/material/Select/SelectInput";

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
        const fetchData = async () => {
            const result: taskList = (await fetcher<taskList>('todo/get', 'get', { userId: localStorage.getItem('userId') })).data
            setTaskList(result)
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
        const result: taskList = (await fetcher<taskList>('todo/get', 'get', { userId: localStorage.getItem('userId') })).data
        setTaskList(result)
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
                status: result[0].status?._id,
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

    return (
        <div>
            <Button onClick={() => { openDialog(1) }}>Add task</Button>
            <Button onClick={() => { controlDrawer(true) }}>Status</Button>
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
                                <FormControl>
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
                                    <InputLabel id="selectStatus">Status</InputLabel>
                                    <Select
                                        labelId="selectStatus"
                                        id="selectStatus"
                                        value={taskInfo.status}
                                        label=""
                                        onChange={statusSelectChange}
                                    >
                                        {
                                            statusList?.map((value, index) => {
                                                return <MenuItem key={index} value={value._id}>{value.name}</MenuItem>
                                            })
                                        }
                                    </Select>
                                    <input
                                        type="date"
                                        value={taskInfo.deadline}
                                        onChange={deadlineChange}
                                    ></input>
                                </FormControl>
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

            <div>
                {
                    taskList?.map((v, i) => {
                        return <div key={i} style={{ backgroundColor: v.status.color, width: '400px' }}>
                            <div>{v.taskName}</div>
                            <div>{v.status.name}</div>
                            <div>{v.deadline.toString().split('T')[0]}</div>
                            <Button onClick={() => { changeTask(v._id) }}>change</Button>
                            <Button onClick={() => { deleteTask(v._id) }}>delete</Button>
                        </div>
                    })
                }
            </div>

            <Drawer
                open={drawerOpen}
                onClose={() => { controlDrawer(false) }}
                anchor={'right'}>
                <Button onClick={() => { openDialog(2) }}>Add status</Button>
                {
                    statusList?.map((v, i) => {
                        return <div key={i}>
                            <div>{v.name}</div>
                            <div>{v.color}</div>
                            <Button onClick={() => { changeUpdate(v._id) }}>update</Button>
                            {/* <Button onClick={() => { deleteStatus(v._id) }}>delete</Button> */}
                        </div>
                    })
                }
            </Drawer>
        </div>
    )

}

export default HomePage