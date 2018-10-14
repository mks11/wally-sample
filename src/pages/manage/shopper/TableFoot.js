import React from 'react'

const totalPrice = ({ shopitems }) => shopitems && shopitems.reduce((sum, item) => sum + item.product_price, 0)

const TableFoot = ({ shopitems }) => (
  <tfoot>
    <tr>
      <td colSpan="4"></td>
      <td colSpan="2"><b>Total Price:</b> ${totalPrice({ shopitems }) / 100}</td>
      <td colSpan="2"></td>
    </tr>
  </tfoot>
)

export default TableFoot