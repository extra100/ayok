import React, { useRef, useEffect } from 'react'
import { Button } from 'react-bootstrap'
import ReactToPrint from 'react-to-print'
import ComponentToPrintMutasi from '../pindah/ComponentToPrintMutasi'

import MutasiPrint from './MutasiPrint'

export default function MutasiPrintKomponen() {
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
            <MutasiPrint ref={componentRef} />
          </div>
        </div>
      </div>
    </>
  )
}
