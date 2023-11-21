// import { useContext } from 'react'
// import { Button, Card, Table } from 'react-bootstrap'
// import { Link } from 'react-router-dom'
// import { toast } from 'react-toastify'
// import { Store } from '../Store'
// import { CartItem } from '../types/Cart'
// import { Product } from '../types/Product'
// import { convertProductToCartItem } from '../utils'
// import Rating from './Rating'

// function ProductItem({ product }: { product: Product }) {
//   const { state, dispatch } = useContext(Store)
//   const {
//     cart: { cartItems },
//   } = state

//   const addToCartHandler = (item: CartItem) => {
//     const existItem = cartItems.find((x) => x._id === product._id)
//     const quantity = existItem ? existItem.quantity + 1 : 1
//     if (product.stok < quantity) {
//       alert('Sorry. Product is out of stock')
//       return
//     }
//     dispatch({
//       type: 'CART_ADD_ITEM',
//       payload: { ...item, quantity },
//     })
//     toast.success('produk berhasil ditambahkan')
//   }

//   return (
//     <Table striped bordered>
//       <thead>
//         <tr>
//           <th>Nama Barang</th>
//           <th>Harga</th>
//           <th>Bungkus</th>
//         </tr>
//       </thead>
//       <tbody>
//         <tr>
//           <td>{product.nama_barang}</td>
//           <td>Rp{product.harga_beli}</td>
//           <td>
//             {product.stok === 0 ? (
//               <Button variant="light" disabled>
//                 Out of stock
//               </Button>
//             ) : (
//               <Button
//                 onClick={() =>
//                   addToCartHandler(convertProductToCartItem(product))
//                 }
//               >
//                 Add to cart
//               </Button>
//             )}
//           </td>
//         </tr>
//       </tbody>
//     </Table>
//   )
// }

// export default ProductItem
