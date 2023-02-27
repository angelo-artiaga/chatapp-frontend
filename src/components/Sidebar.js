import React, { useContext, useEffect } from 'react'
import { ListGroup } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { AppContext } from './context/appContext'

const Sidebar = () => {
  //const groups = ['first group', 'second group', 'third group']
  const user = useSelector((state) => state.user)
  const {
    socket,
    setMembers,
    members,
    setCurrentRoom,
    setRooms,
    privateMemberMsg,
    rooms,
    setPrivateMemberMsg,
    currentRoom,
  } = useContext(AppContext)

  function joinRoom(room, isPublic = true) {
    if (!user) {
      return alert('Please Login')
    }
    socket.emit('join-room', room)
    setCurrentRoom(room)

    if (isPublic) {
      setPrivateMemberMsg(null)
    }
    //dispatch for notification
  }

  useEffect(() => {
    if (user) {
      setCurrentRoom('general')
      getRooms()
      socket.emit('join-room', 'general')
      socket.emit('new-user')
    }
  }, [])

  socket.off('new-user').on('new-user', (payload) => {
    setMembers(payload)
  })

  function getRooms() {
    fetch('http://localhost:5001/rooms')
      .then((res) => res.json())
      .then((data) => setRooms(data))
  }
  if (!user) {
    return <></>
  }

  return (
    <>
      <h2>Group chats</h2>
      <ListGroup>
        {rooms.map((room, idx) => {
          return (
            <ListGroup.Item
              key={idx}
              onClick={() => joinRoom(room)}
              active={room == currentRoom}
              style={{
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              {room} {currentRoom !== room && <span></span>}
            </ListGroup.Item>
          )
        })}
      </ListGroup>
      <h2>Members</h2>
      {members.map((member) => (
        <ListGroup.Item key={member.id} style={{ cursor: 'pointer' }}>
          {member.name}
        </ListGroup.Item>
      ))}
    </>
  )
}

export default Sidebar
