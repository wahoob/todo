import React from 'react'
import cross from './images/icon-cross.svg'
import edit from './images/edit_FILL0_wght400_GRAD0_opsz24.svg'
import { useGlobalContext } from './context'

const Task = ({ id, text, isChecked }) => {
    const { editCheckButton, removeTask, setEditId, changeInput, setIsEditing } = useGlobalContext()
    const HandleEdit = () => {
        setEditId(id)
        changeInput(text)
        setIsEditing()
    }
    return (
        <div className='todo__current-tasks__main__task'>
            <div className='todo__current-tasks__main__task__item'>
                <div
                    className={isChecked ? 'todo__checked todo__checked--active' : 'todo__checked'}
                    onClick={() => editCheckButton(id)}
                />
                <p className={isChecked ? 'todo__current-tasks__main__task__item__title todo__current-tasks__main__task__item__title--completed' : 'todo__current-tasks__main__task__item__title'}>
                    {text}
                </p>
            </div>
            <div className='todo__current-tasks__main__task__btns'>
                <button onClick={HandleEdit}>
                    <img src={edit} alt='edit' />
                </button>
                <button onClick={() => removeTask(id)}>
                    <img src={cross} alt='cross' />
                </button>
            </div>
        </div>
    )
}

export default Task
