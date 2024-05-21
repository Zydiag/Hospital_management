import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faForward } from '@fortawesome/free-solid-svg-icons'
import { faBackward } from '@fortawesome/free-solid-svg-icons'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'

function Pagination() {
  return (
    <div>
        <ButtonGroup variant='contained' aria-label='Basic button group'>
          <Button><FontAwesomeIcon icon={faBackward} /></Button>
          <Button>1</Button>
          <Button>...</Button>
          <Button>2</Button>
          <Button>3</Button>
          <Button>...</Button>
          <Button>50</Button>
          <Button><FontAwesomeIcon icon={faForward} /></Button>
        </ButtonGroup>
    </div>
  )
}

export default Pagination