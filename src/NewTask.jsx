import React, { useEffect, useRef } from 'react'
import { useGlobalContext } from './context'

const NewTask = () => {
    const inputRef = useRef(null)
    const { addTask, input, changeInput, isChecked, changeIsChecked, isEditing, editText } = useGlobalContext()
    const handleSubmit = (e) => {
        e.preventDefault()
        if (isEditing) {
            editText()
        } else {
            addTask()
        }
        inputRef.current.blur()
    }
    const handleChecked = () => {
        changeIsChecked(!isChecked)
        inputRef.current.focus()
    }
    useEffect(() => {
        inputRef.current.focus()
    }, [])
    useEffect(() => {
        if (isEditing) {
            inputRef.current.focus()
        }
    }, [isEditing])
    return (
        <div className="todo__new-task">
            <div
                className={isChecked ? 'todo__checked todo__checked--active' : 'todo__checked'}
                onClick={handleChecked}
            />
            <form className='todo__new-task__input' onSubmit={handleSubmit}>
                <input
                    type='text'
                    placeholder='Create a new todo...'
                    value={input}
                    onChange={(e) => changeInput(e.target.value)}
                    ref={inputRef}
                />
                <label className='todo__new-task__line' />
            </form>
        </div>
    )
}

export default NewTask
