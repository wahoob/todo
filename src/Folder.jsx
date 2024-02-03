import React, { useEffect, useRef, useState } from 'react'
import expandMore from './images/expand-more.svg'
import expandLess from './images/expand-less.svg'
import add from './images/add_FILL0_wght400_GRAD0_opsz24.svg'
import { useGlobalContext } from './context'

const Folder = ({ active }) => {
    const [isExpand, setIsExpand] = useState(false)
    const [currentName, setCurrentName] = useState('')
    const [isAdding, setIsAdding] = useState(false)
    const inputRef = useRef(null)
    const { foldersNames, currentFolderIndex, changeCurrentFolderIndex, editFolderName, addFolder } = useGlobalContext()
    const handleSubmit = (e) => {
        e.preventDefault()
        if (isAdding) {
            addFolder(currentName)
            setIsAdding(false)
        } else {
            editFolderName(currentName)
        }
        if (currentName.length < 1) {
            setCurrentName(foldersNames[currentFolderIndex].name)
        }
        inputRef.current.blur()
        inputRef.current.placeholder = ''
    }
    const handleBlur = () => {
        inputRef.current.placeholder = ''
        setCurrentName(foldersNames[currentFolderIndex].name)
    }
    const handleAdding = () => {
        setIsAdding(true)
        setCurrentName('')
        inputRef.current.focus()
        inputRef.current.placeholder = 'add new folder'
    }
    useEffect(() => {
        if (!active) {
            setIsExpand(false)
            setIsAdding(false)
        }
    }, [active])
    useEffect(() => {
        const folderName = foldersNames.find((_, index) => index === currentFolderIndex)
        if (folderName) {
            setCurrentName(folderName.name)
        }
    }, [currentFolderIndex, foldersNames])
    return (
        <>
            <div className="todo__header__icons__folders">
                <form className={active ? 'todo__header__icons__folders__container todo__header__icons__folders__container--active' : 'todo__header__icons__folders__container'}
                    onSubmit={handleSubmit}
                >
                    <img src={add} alt='add'
                        onClick={handleAdding}
                    />
                    <img src={isExpand ? expandLess : expandMore} alt='expand'
                        onClick={() => setIsExpand(!isExpand)}
                    />
                    <input
                        type='text'
                        value={currentName}
                        onChange={(e) => setCurrentName(e.target.value)}
                        onBlur={handleBlur}
                        ref={inputRef}
                    />
                </form>
            </div>
            <div className={isExpand ? 'todo__header__icons__more todo__header__icons__more--active' : 'todo__header__icons__more'}>
                {foldersNames.map((folderName) => {
                    const { name, index } = folderName
                    return (
                        <div key={index} className='todo__header__icons__more__folder'
                            onClick={() => {
                                changeCurrentFolderIndex(index)
                                setIsExpand(false)
                            }}
                        >
                            {name}
                        </div>
                    )
                })}
            </div>
        </>
    )
}

export default Folder
