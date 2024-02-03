import React, { createContext, useCallback, useContext, useEffect, useReducer, useState } from "react";

const AppContext = createContext()

export const statuses = ['all', 'active', 'completed']

const initialFolder =
{
    name: 'folder',
    list: []
}
const initialState = {
    folders: [initialFolder],
    currentFolderIndex: 0,
    input: '',
    list: [],
    isChecked: false,
    isEditing: false,
    editId: undefined,
}
const ACTIONS = {
    CHANGE_INPUT: 'change_input',
    CHANGE_IS_CHECKED: 'change_is_checked',
    ADD_TASK: 'add_task',
    EDIT_CHECKBUTTON: 'edit_checkbutton',
    SET_EDIT_ID: 'set_edit_id',
    SET_IS_EDITING: 'set_is_editing',
    EDIT_TEXT: 'edit_text',
    REMOVE_TASK: 'remove_task',
    CLEAR_COMPLETED: 'clear_completed',
    SET_SELECTED_TASKS: 'set_selected_tasks',
    UPDATE_FOLDERS_LIST: 'update_folders_list',
    UPDATE_LIST: 'update_list',
    CHANGE_CURRENT_FOLDER_INDEX: 'change_current_folder_index',
    EDIT_FOLDER_NAME: 'edit_folder_name',
    ADD_FOLDER: 'add_folder',
    SET_STATE_FROM_STORAGE: 'set_state_from_storage',
    REORDER_LIST: 'reorder_list',
}

const reducer = (state, { type, payload }) => {
    switch (type) {
        case ACTIONS.CHANGE_INPUT:
            return { ...state, input: payload.input }
        case ACTIONS.CHANGE_IS_CHECKED:
            return { ...state, isChecked: payload.checked }
        case ACTIONS.ADD_TASK:
            if (state.input.length > 0) {
                const newTask = { id: new Date().getTime(), isChecked: state.isChecked, text: state.input }
                return {
                    ...state,
                    list: [...state.list, newTask],
                    isChecked: false,
                    input: ''
                }
            }
            return state
        case ACTIONS.EDIT_CHECKBUTTON:
            const newList = state.list.map((task) => {
                if (task.id === payload.id) {
                    return { ...task, isChecked: !task.isChecked }
                }
                return task
            })
            return { ...state, list: newList }
        case ACTIONS.REMOVE_TASK:
            const newList1 = state.list.filter(task => task.id !== payload.id)
            return { ...state, list: newList1 }
        case ACTIONS.SET_EDIT_ID:
            return { ...state, editId: payload.id }
        case ACTIONS.SET_IS_EDITING:
            return { ...state, isEditing: true }
        case ACTIONS.EDIT_TEXT:
            const newList2 = state.list.map((task) => {
                if (task.id === state.editId) {
                    return { ...task, text: state.input }
                }
                return task
            })
            return {
                ...state,
                list: newList2,
                isEditing: false,
                editId: undefined,
                input: '',
            }
        case ACTIONS.CLEAR_COMPLETED:
            const newList3 = state.list.filter(task => task.isChecked === false)
            return { ...state, list: newList3 }
        case ACTIONS.UPDATE_FOLDERS_LIST:
            const newFolders = state.folders.map((folder, index) => {
                if (index === state.currentFolderIndex) {
                    return { ...folder, list: state.list }
                }
                return folder
            })
            return { ...state, folders: newFolders }
        case ACTIONS.UPDATE_LIST:
            const updatedFolder = state.folders.find((_, index) => index === state.currentFolderIndex)
            return { ...state, list: updatedFolder.list }
        case ACTIONS.CHANGE_CURRENT_FOLDER_INDEX:
            return { ...state, currentFolderIndex: payload.index }
        case ACTIONS.EDIT_FOLDER_NAME:
            const newFolders1 = state.folders.map((folder, index) => {
                if (index === state.currentFolderIndex) {
                    if (payload.name.length > 0) {
                        return { ...folder, name: payload.name }
                    }
                }
                return folder
            })
            return { ...state, folders: newFolders1 }
        case ACTIONS.ADD_FOLDER:
            if (payload.folderName.length > 0 && state.folders.length < 4) {
                const newFolder = { name: payload.folderName, list: [] }
                return {
                    ...state,
                    folders: [...state.folders, newFolder],
                    currentFolderIndex: state.folders.length,
                }
            }
            return state
        case ACTIONS.REORDER_LIST:
            const { firstId, secondId } = payload
            const updatedList = [...state.list]
            const firstIndex = updatedList.findIndex(task => task.id === firstId)
            const secondIndex = updatedList.findIndex(task => task.id === secondId)
            //swap
            console.log(firstId, secondId)
            const temp = updatedList[firstIndex]
            updatedList[firstIndex] = updatedList[secondIndex]
            updatedList[secondIndex] = temp
            return { ...state, list: updatedList }
        default:
            return state
    }
}

export const AppProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState)
    const [active, setActive] = useState(0)
    const [selectedTasks, setSelectedTasks] = useState(state.list)
    const [numOfActive, setNumOfActive] = useState(0)
    const [foldersNames, setFoldersNames] = useState([]) //{index: 0, name: ''}
    const changeInput = (input) => {
        dispatch({ type: ACTIONS.CHANGE_INPUT, payload: { input } })
    }
    const changeIsChecked = (checked) => {
        dispatch({ type: ACTIONS.CHANGE_IS_CHECKED, payload: { checked } })
    }
    const addTask = () => {
        dispatch({ type: ACTIONS.ADD_TASK })
    }
    const editCheckButton = (id) => {
        dispatch({ type: ACTIONS.EDIT_CHECKBUTTON, payload: { id } })
    }
    const removeTask = (id) => {
        dispatch({ type: ACTIONS.REMOVE_TASK, payload: { id } })
    }
    const setEditId = (id) => {
        dispatch({ type: ACTIONS.SET_EDIT_ID, payload: { id } })
    }
    const setIsEditing = () => {
        dispatch({ type: ACTIONS.SET_IS_EDITING })
    }
    const editText = () => {
        dispatch({ type: ACTIONS.EDIT_TEXT })
    }
    const clearCompleted = () => {
        dispatch({ type: ACTIONS.CLEAR_COMPLETED })
    }
    const updateFolderList = () => {
        dispatch({ type: ACTIONS.UPDATE_FOLDERS_LIST })
    }
    const updateList = () => {
        dispatch({ type: ACTIONS.UPDATE_LIST })
    }
    const changeCurrentFolderIndex = (index) => {
        dispatch({ type: ACTIONS.CHANGE_CURRENT_FOLDER_INDEX, payload: { index } })
    }
    const editFolderName = (name) => {
        dispatch({ type: ACTIONS.EDIT_FOLDER_NAME, payload: { name } })
    }
    const addFolder = (folderName) => {
        dispatch({ type: ACTIONS.ADD_FOLDER, payload: { folderName } })
    }
    const reorderList = (firstId, secondId) => {
        dispatch({ type: ACTIONS.REORDER_LIST, payload: { firstId, secondId } })
    }
    // show the tasks in a particular list based on the status
    const showTasks = useCallback((status = 'all') => {
        const temp = statuses.findIndex(statusItem => statusItem === status)
        if (status === 'all') {
            setSelectedTasks(state.list)
            setActive(temp)
        } else if (status === 'active') {
            const tempList = state.list.filter(item => item.isChecked === false)
            setSelectedTasks(tempList)
            setActive(temp)
        } else {
            const tempList = state.list.filter(item => item.isChecked === true)
            setSelectedTasks(tempList)
            setActive(temp)
        }
    }, [state.list])
    useEffect(() => {
        showTasks()
    }, [showTasks])
    // get the number of active 'not completed' tasks in a paritcular list
    useEffect(() => {
        setNumOfActive(state.list.filter(task => !task.isChecked).length);
    }, [state.list]);
    // update the folder evert time we change the list
    useEffect(() => {
        updateFolderList()
    }, [state.list])
    // update the list every time we change the folder
    useEffect(() => {
        updateList()
    }, [state.currentFolderIndex])
    // get folders name
    useEffect(() => {
        const temp = state.folders.map((folder, index) => {
            return { index, name: folder.name }
        })
        setFoldersNames(temp)
    }, [state.folders])
    // // retrieve state from local storage
    // useEffect(() => {
    //     const savedState = JSON.parse(localStorage.getItem('todoApp'))
    //     if (savedState) {
    //         dispatch({ type: ACTIONS.SET_STATE_FROM_STORAGE, payload: { savedState } })
    //     }
    // }, [])
    // //save state to local storage on every change
    // useEffect(() => {
    //     localStorage.setItem('todoApp', JSON.stringify(state))
    // }, [state])
    return (
        <AppContext.Provider value={{
            changeInput,
            changeIsChecked,
            addTask,
            editCheckButton,
            removeTask,
            setEditId,
            setIsEditing,
            editText,
            clearCompleted,
            showTasks,
            changeCurrentFolderIndex,
            editFolderName,
            addFolder,
            reorderList,
            isChecked: state.isChecked,
            input: state.input,
            list: state.list,
            isEditing: state.isEditing,
            selectedTasks,
            active,
            numOfActive,
            foldersNames,
            currentFolderIndex: state.currentFolderIndex,
        }}>
            {children}
        </AppContext.Provider>
    )
}

export const useGlobalContext = () => {
    return useContext(AppContext)
}