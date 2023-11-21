import React, { useRef, useEffect } from 'react'
import { Button } from 'react-bootstrap'
import ReactToPrint from 'react-to-print'
import ComponentToPrintMutasi from '../pindah/ComponentToPrintMutasi'

import ComponentToPrint from './ComponentToPrint'

export default function PrintComponent() {
  const componentRef = useRef(null)

  return (
    <>
      <div id="print_component">
        <ReactToPrint
          trigger={() => <Button>Kirim Po!</Button>}
          content={() => componentRef.current}
        />
        <div style={{ display: 'none' }}>
          <div ref={componentRef}>
            {' '}
            <ComponentToPrintMutasi ref={componentRef} />
          </div>
        </div>
      </div>
    </>
  )
}
