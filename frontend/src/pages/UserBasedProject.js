import React from 'react'
import MyProject from './MyProject'

const UserBasedProject = ({projects, users}) => {
  return (
    <div >
      <MyProject users={users}/>
    </div>
  )
}

export default UserBasedProject
