import React, { useEffect, useRef, useState } from "react";
import Task from "./Task";
import NewTask from "./NewTask";
import sun from './images/icon-sun.svg'
import moon from './images/icon-moon.svg'
import FooterElement from "./FooterElement";
import { statuses, useGlobalContext } from './context'
import closedMenu from './images/menu_close.svg'
import openedMenu from './images/menu_open.svg'
import Folder from "./Folder";

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDark, setIsDark] = useState(true)
  const menuRef = useRef(null)
  const { selectedTasks, clearCompleted, active, numOfActive } = useGlobalContext()
  useEffect(() => {
    let handler = (e) => {
      if (!menuRef.current.contains(e.target)) {
        setIsMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
  })
  const setDartMode = () => {
    document.querySelector("body").setAttribute("data-theme", "dark")
  }
  const setLightMode = () => {
    document.querySelector("body").setAttribute("data-theme", "light")
  }
  useEffect(() => {
    if (isDark) {
      setDartMode()
    } else {
      setLightMode()
    }
  }, [isDark])
  return (
    <div className="container">
      <div className="todo">
        <div className="todo__header">
          <h1 className="todo__header__title">todo</h1>
          <div className="todo__header__icons" ref={menuRef}>
            <img src={isMenuOpen ? openedMenu : closedMenu} alt="menu"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            />
            <img src={isDark ? sun : moon} alt="change theme"
              onClick={() => setIsDark(!isDark)}
            />
            <Folder active={isMenuOpen} />
          </div>
        </div>
        <NewTask />
        <div className="todo__current-tasks">
          {selectedTasks.length > 0 ? (
            <div className="todo__current-tasks__main">
              {selectedTasks.map((task) => <Task key={task.id} id={task.id} isChecked={task.isChecked} text={task.text} />)}
            </div>
          ) : (
            <div className="todo__not-found">
              <p className="todo__not-found__text">No Tasks Found</p>
            </div>
          )}
          <div className="todo__current-tasks__footer">
            <p className="todo__current-tasks__footer__text">{numOfActive} items left</p>
            <p
              className="todo__current-tasks__footer__text todo__current-tasks__footer__text--clear"
              onClick={() => clearCompleted()}
            >
              Clear Completed
            </p>
          </div>
        </div>
        <div className="todo__footer">
          {statuses.map((status, index) => <FooterElement key={index} isActive={active === index} status={status} />)}
        </div>
        <p className="todo__text">Drag and drop to reorder list</p>
      </div>
    </div>
  );
}

export default App;
