'use client';

import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import Image from 'next/image';
import { Container, Card, Row, Col, Spinner } from 'react-bootstrap';
import { FaTrash, FaMinus, FaPlus, FaArrowRight, FaShoppingBag, FaArrowLeft, FaTruck, FaShoppingCart } from 'react-icons/fa';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();

  if (cart.length === 0) {
      return (
          <Container className="text-center py-5 d-flex flex-column align-items-center justify-content-center" style={{minHeight: '60vh'}}>
                <div className="mb-4 d-inline-flex align-items-center justify-content-center"
                     style={{ width: 100, height: 100, borderRadius: '50%', background: 'linear-gradient(135deg, #eef2ff, #e0e7ff)', boxShadow: '0 8px 24px rgba(99,102,241,0.12)' }}>
                  <FaShoppingBag size={40} style={{ color: '#a5b4fc' }}/>
                </div>
                <h3 className="fw-bold text-dark mb-2">ตะกร้าของคุณว่างเปล่า</h3>
                <p className="text-muted mb-4">เลือกซื้อสินค้าที่ถูกใจแล้วกลับมาใหม่นะครับ</p>
                <Link href="/products">
                  <button className="btn-bounce border-0 rounded-pill px-5 py-3 fw-bold text-white d-flex align-items-center gap-2"
                          style={{ background: 'linear-gradient(135deg, #818cf8, #4f46e5)', boxShadow: '0 4px 16px rgba(99,102,241,0.3)' }}>
                      <FaShoppingCart size={16}/> ไปเลือกซื้อสินค้า
                  </button>
                </Link>
            </Container>
      );
  }

  const handleSetQuantity = (uniqueKey: string, value: string, currentQty: number) => {
    const num = parseInt(value, 10);
    if (value === '' || isNaN(num) || num < 1) return;
    const delta = num - currentQty;
    if (delta !== 0) updateQuantity(uniqueKey, delta);
  };

  return (
    <Container style={{ paddingTop: '2rem', paddingBottom: '100px' }}>
        {/* Header */}
        <div className="d-flex align-items-center mb-4 gap-3">
            <Link href="/products"
                  className="btn-bounce btn-bounce-back text-decoration-none d-inline-flex align-items-center justify-content-center rounded-circle"
                  style={{ width: 40, height: 40, background: '#fff', color: '#6366f1', boxShadow: '0 2px 8px rgba(99,102,241,0.12)', border: '1px solid #e0e7ff' }}>
                <FaArrowLeft size={14} />
            </Link>
            <div>
                <h4 className="fw-bold mb-0 text-dark">ตะกร้าสินค้า</h4>
                <small className="text-muted">{cart.length} รายการ</small>
            </div>
        </div>

        <Row className="g-4">
            {/* รายการสินค้า */}
            <Col lg={8}>
                <Card className="border-0 rounded-4 overflow-hidden" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
                    {/* Table Header */}
                    <div className="px-4 py-3 d-none d-md-flex fw-semibold small"
                         style={{ background: 'linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #fff 100%)', color: '#64748b', borderBottom: '1px solid #e0e7ff' }}>
                        <div style={{width: '50%'}}>สินค้า</div>
                        <div style={{width: '20%'}} className="text-center">ราคา</div>
                        <div style={{width: '20%'}} className="text-center">จำนวน</div>
                        <div style={{width: '10%'}}></div>
                    </div>

                    {cart.map((item, idx) => (
                        <div key={item.uniqueKey}
                             className="d-flex flex-wrap flex-md-nowrap align-items-center p-3 px-4"
                             style={{
                               background: idx % 2 === 0 ? '#ffffff' : '#f8fafc',
                               borderBottom: '1px solid #f1f5f9',
                               transition: 'all 0.2s'
                             }}>
                            {/* รูป + ชื่อ */}
                            <div className="d-flex align-items-center" style={{width: '50%', minWidth: '200px'}}>
                                <div className="position-relative rounded-3 overflow-hidden flex-shrink-0 me-3"
                                     style={{ width: 64, height: 64, border: '1px solid #e0e7ff', boxShadow: '0 2px 8px rgba(99,102,241,0.08)' }}>
                                    <Image src={item.imageUrl} alt={item.name} fill style={{objectFit:'cover'}}/>
                                </div>
                                <div>
                                    <h6 className="fw-bold mb-1 text-dark text-truncate" style={{maxWidth: '180px', fontSize: '0.9rem'}}>{item.name}</h6>
                                    <span className="fw-semibold px-2 py-1 rounded-pill d-inline-block"
                                          style={{ fontSize: '0.7rem', background: 'linear-gradient(135deg, #eef2ff, #e0e7ff)', color: '#4f46e5', border: '1px solid #c7d2fe' }}>
                                        ไซส์ {item.size}
                                    </span>
                                </div>
                            </div>

                            {/* ราคา (Desktop) */}
                            <div className="d-none d-md-flex align-items-center justify-content-center fw-bold" style={{width: '20%', color: '#4f46e5'}}>
                                ฿{(item.price * item.quantity).toLocaleString()}
                            </div>

                            {/* ปุ่มเพิ่มลด */}
                            <div className="d-flex flex-column align-items-center justify-content-center" style={{width: '20%'}}>
                                <div className="d-flex align-items-center rounded-pill px-1 py-1"
                                     style={{ background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                                    <button
                                        type="button"
                                        className="btn-bounce rounded-circle p-0 d-flex align-items-center justify-content-center border-0"
                                        style={{
                                          width: 30, height: 30,
                                          background: item.quantity <= 1 ? '#f8f9fa' : 'linear-gradient(135deg, #fee2e2, #fecaca)',
                                          color: item.quantity <= 1 ? '#cbd5e1' : '#dc2626',
                                          boxShadow: item.quantity <= 1 ? 'none' : '0 1px 4px rgba(239,68,68,0.15)',
                                          cursor: item.quantity <= 1 ? 'not-allowed' : 'pointer'
                                        }}
                                        onClick={() => updateQuantity(item.uniqueKey, -1)}
                                        disabled={item.quantity <= 1}
                                    >
                                        <FaMinus size={9}/>
                                    </button>

                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        className="fw-bold text-center border-0 bg-transparent"
                                        style={{ width: 32, fontSize: '0.95rem', color: '#1e293b', outline: 'none' }}
                                        value={item.quantity}
                                        onChange={(e) => handleSetQuantity(item.uniqueKey, e.target.value, item.quantity)}
                                    />

                                    <button
                                        type="button"
                                        className="btn-bounce rounded-circle p-0 d-flex align-items-center justify-content-center border-0 text-white"
                                        style={{
                                          width: 30, height: 30,
                                          background: item.quantity >= item.maxStock ? '#e2e8f0' : 'linear-gradient(135deg, #818cf8, #4f46e5)',
                                          color: item.quantity >= item.maxStock ? '#94a3b8' : '#fff',
                                          boxShadow: item.quantity >= item.maxStock ? 'none' : '0 1px 4px rgba(99,102,241,0.3)',
                                          cursor: item.quantity >= item.maxStock ? 'not-allowed' : 'pointer'
                                        }}
                                        onClick={() => updateQuantity(item.uniqueKey, 1)}
                                        disabled={item.quantity >= item.maxStock}
                                    >
                                        <FaPlus size={9}/>
                                    </button>
                                </div>
                                <small className="mt-1" style={{ fontSize: '0.65rem', color: item.quantity >= item.maxStock ? '#ef4444' : '#94a3b8' }}>
                                    {item.quantity >= item.maxStock ? 'เต็มแล้ว' : `เพิ่มได้อีก ${item.maxStock - item.quantity}`}
                                </small>
                            </div>

                            {/* ราคา (Mobile only) */}
                            <div className="d-md-none ms-auto fw-bold small" style={{ color: '#4f46e5' }}>
                                ฿{(item.price * item.quantity).toLocaleString()}
                            </div>

                            {/* ปุ่มลบ */}
                            <div className="text-end" style={{width: '10%'}}>
                                <button
                                    type="button"
                                    className="btn-bounce btn-bounce-close rounded-circle border-0 d-flex align-items-center justify-content-center"
                                    style={{ width: 32, height: 32, background: '#fff', color: '#ef4444', boxShadow: '0 1px 4px rgba(239,68,68,0.1)', border: '1px solid #fecaca' }}
                                    onClick={() => removeFromCart(item.uniqueKey)}
                                >
                                    <FaTrash size={11}/>
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Footer */}
                    <div className="p-3 px-4 d-flex justify-content-between align-items-center"
                         style={{ background: 'linear-gradient(135deg, #fef2f2, #fff5f5)', borderTop: '1px solid #fecaca' }}>
                        <button type="button" className="btn-bounce border-0 fw-semibold d-flex align-items-center gap-1 rounded-pill px-3 py-1"
                                style={{ background: 'linear-gradient(135deg, #fee2e2, #fecaca)', color: '#dc2626', fontSize: '0.8rem', boxShadow: '0 1px 4px rgba(239,68,68,0.12)' }}
                                onClick={clearCart}>
                            <FaTrash size={10}/> ล้างตะกร้า
                        </button>
                        <span className="d-md-none fw-bold" style={{ color: '#4f46e5' }}>รวม: ฿{cartTotal.toLocaleString()}</span>
                    </div>
                </Card>
            </Col>

            {/* สรุปยอด */}
            <Col lg={4}>
                <Card className="border-0 rounded-4 overflow-hidden sticky-top" style={{top: '100px', boxShadow: '0 8px 32px rgba(0,0,0,0.08)'}}>
                    {/* Header */}
                    <div className="p-4 pb-3"
                         style={{ background: 'linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #fff 100%)', borderBottom: '1px solid #e0e7ff' }}>
                        <h5 className="fw-bold mb-0 text-dark d-flex align-items-center gap-2">
                            <div className="d-flex align-items-center justify-content-center rounded-circle"
                                 style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #818cf8, #4f46e5)', boxShadow: '0 2px 8px rgba(99,102,241,0.25)' }}>
                                <FaShoppingCart size={13} className="text-white"/>
                            </div>
                            สรุปคำสั่งซื้อ
                        </h5>
                    </div>

                    {/* Body */}
                    <div className="p-4">
                        <div className="d-flex justify-content-between mb-3 align-items-center">
                            <span className="text-secondary">ยอดรวมสินค้า</span>
                            <span className="fw-bold text-dark">฿{cartTotal.toLocaleString()}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-4 align-items-center">
                            <span className="text-secondary">ค่าจัดส่ง</span>
                            <span className="fw-semibold px-2 py-1 rounded-pill d-flex align-items-center gap-1"
                                  style={{ fontSize: '0.72rem', background: 'linear-gradient(135deg, #ecfdf5, #d1fae5)', color: '#059669', border: '1px solid #a7f3d0' }}>
                                <FaTruck size={10}/> คำนวณหน้าถัดไป
                            </span>
                        </div>

                        <div className="rounded-3 p-3 mb-4"
                             style={{ background: 'linear-gradient(135deg, #eef2ff, #e0e7ff)', border: '1px solid #c7d2fe' }}>
                            <div className="d-flex justify-content-between align-items-center">
                                <span className="fw-bold text-dark">ยอดสุทธิ</span>
                                <span className="fw-bold fs-3" style={{ color: '#4f46e5' }}>฿{cartTotal.toLocaleString()}</span>
                            </div>
                        </div>

                        <Link href="/checkout" className="text-decoration-none d-block mb-3">
                            <button type="button"
                                    className="btn-bounce w-100 border-0 py-3 rounded-pill fw-bold text-white d-flex align-items-center justify-content-center gap-2"
                                    style={{ background: 'linear-gradient(135deg, #818cf8, #4f46e5)', boxShadow: '0 4px 16px rgba(99,102,241,0.3)', fontSize: '1rem' }}>
                                ดำเนินการสั่งซื้อ <FaArrowRight size={14}/>
                            </button>
                        </Link>

                        <div className="text-center">
                            <Link href="/products" className="text-decoration-none">
                                <button type="button"
                                        className="btn-bounce border-0 bg-transparent fw-semibold d-inline-flex align-items-center gap-1"
                                        style={{ color: '#6366f1', fontSize: '0.85rem' }}>
                                    <FaArrowLeft size={11}/> ซื้อสินค้าเพิ่มเติม
                                </button>
                            </Link>
                        </div>
                    </div>
                </Card>
            </Col>
        </Row>
    </Container>
  );
}
