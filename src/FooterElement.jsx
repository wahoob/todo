import React from 'react'
import { useGlobalContext } from './context'

const FooterElement = ({ status, isActive }) => {
    const { showTasks } = useGlobalContext()
    return (
        <p
            className={isActive ? 'todo__footer__text todo__footer__text--active' : 'todo__footer__text'}
            onClick={() => showTasks(status)}
        >
            {status}
        </p>
    )
}

export default FooterElement
