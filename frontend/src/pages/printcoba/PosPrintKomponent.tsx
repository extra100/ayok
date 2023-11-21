import React, { useRef, useEffect } from 'react'
import { Button } from 'react-bootstrap'
import ReactToPrint from 'react-to-print'
import ComponentToPrintMutasi from '../pindah/ComponentToPrintMutasi'
import PosPrint from '../pos/PosPrint'

import ComponentToPrint from './ComponentToPrint'

export default function PosPrintKomponent() {
  const componentRef = useRef(null)

  return (
    <>
      <div id="print_component_ku">
        <ReactToPrint
          trigger={() => <span>Print</span>}
          content={() => componentRef.current}
        />
        <div style={{ display: 'none' }}>
          <div ref={componentRef}>
            {' '}
            <PosPrint ref={componentRef} />
          </div>
        </div>
      </div>
    </>
  )
}
