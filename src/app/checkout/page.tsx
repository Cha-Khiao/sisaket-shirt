'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Row, Col, Card, Form, Spinner, Alert } from 'react-bootstrap';
import { FaUser, FaTruck, FaMapMarkerAlt, FaClipboardList, FaCheckCircle, FaArrowLeft, FaShoppingCart, FaStore } from 'react-icons/fa';
import { useSession } from "next-auth/react";
import { useCart } from '@/context/CartContext';
import API_ENDPOINTS from '@/lib/api';

export default function CheckoutPage() {
  const { data: session } = useSession();
  const { cart, cartLoaded, cartTotal, cartCount, clearCart } = useCart();
  const router = useRouter();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', phone: '', address: '', isShipping: true
  });

  useEffect(() => {
    if (!session) return;
    const accessToken = (session as any)?.accessToken;
    if (!accessToken) return;

    fetch(API_ENDPOINTS.PROFILE, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) {
          const nameParts = (data.name || '').trim().split(/\s+/);
          const firstName = nameParts[0] || '';
          const lastName = nameParts.slice(1).join(' ') || '';

          let fullAddress = '';
          if (data.addressData) {
            const ad = data.addressData;
            fullAddress = [
              ad.houseNo,
              ad.subdistrict ? `ต.${ad.subdistrict}` : '',
              ad.district ? `อ.${ad.district}` : '',
              ad.province ? `จ.${ad.province}` : '',
              ad.zipcode,
            ].filter(Boolean).join(' ');
          } else if (data.address) {
            fullAddress = data.address;
          }

          setFormData(prev => ({
            ...prev,
            firstName: prev.firstName || firstName,
            lastName: prev.lastName || lastName,
            phone: prev.phone || data.phone || '',
            address: prev.address || fullAddress,
          }));
        }
        setProfileLoaded(true);
      })
      .catch(() => setProfileLoaded(true));
  }, [session]);

  useEffect(() => {
    if (cartLoaded && cart.length === 0 && !isSuccess) {
      router.replace('/products');
    }
  }, [cart, cartLoaded, router, isSuccess]);

  const shippingCost = formData.isShipping ? 50 + (Math.max(0, cartCount - 1) * 10) : 0;
  const grandTotal = cartTotal + shippingCost;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!session) return router.push('/auth/login');
    if (formData.isShipping && !formData.address) return setError('กรุณากรอกที่อยู่จัดส่ง');

    setSubmitting(true);

    const payload = {
      customerName: `${formData.firstName} ${formData.lastName}`,
      phone: formData.phone,
      address: formData.isShipping ? formData.address : 'มหาวิทยาลัยราชภัฏศรีสะเกษ',
      isShipping: formData.isShipping,
      items: cart.map(item => ({
        productId: item.productId,
        productName: item.name,
        size: item.size,
        quantity: item.quantity,
        price: item.price
      }))
    };

    try {
      const res = await fetch(API_ENDPOINTS.ORDERS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(session as any)?.accessToken}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'สั่งซื้อไม่สำเร็จ');

      fetch(API_ENDPOINTS.PROFILE, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(session as any)?.accessToken}`
        },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          phone: formData.phone,
          address: formData.address,
        })
      }).catch(() => {});

      setIsSuccess(true);
      clearCart();
      router.push(`/orders/success/${data._id}`);
    } catch (error: any) {
      console.error(error);
      setError(error.message);
      setSubmitting(false);
    }
  };

  if (!cartLoaded || (cart.length === 0 && !isSuccess)) return null;

  return (
    <Container style={{ paddingTop: '2rem', paddingBottom: '40px' }}>
      {/* Header */}
      <div className="d-flex align-items-center mb-3 gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="btn-bounce btn-bounce-back text-decoration-none d-inline-flex align-items-center justify-content-center rounded-circle border-0"
          style={{ width: 38, height: 38, background: '#fff', color: '#6366f1', boxShadow: '0 2px 8px rgba(99,102,241,0.12)', border: '1px solid #e0e7ff' }}
        >
          <FaArrowLeft size={14} />
        </button>
        <div>
          <h5 className="fw-bold mb-0 text-dark">ยืนยันคำสั่งซื้อ</h5>
          <small className="text-muted">{cartCount} รายการ</small>
        </div>
      </div>

      <Form onSubmit={handleSubmit}>
        <Row className="g-3 justify-content-center">
          {/* Left: ข้อมูลผู้รับ + จัดส่ง */}
          <Col lg={7}>
            {/* ข้อมูลผู้รับสินค้า + ที่อยู่ */}
            <Card className="border-0 rounded-4 overflow-hidden mb-3" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
              <div className="py-2 px-4 d-flex align-items-center"
                   style={{ background: 'linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #fff 100%)', borderBottom: '1px solid #e0e7ff' }}>
                <div className="d-flex align-items-center justify-content-center rounded-circle me-3"
                     style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #818cf8, #4f46e5)', boxShadow: '0 2px 8px rgba(99,102,241,0.25)' }}>
                  <FaUser size={12} className="text-white"/>
                </div>
                <h6 className="mb-0 fw-bold text-dark">ข้อมูลผู้รับสินค้า</h6>
              </div>
              <Card.Body className="p-3 px-4">
                <Row className="g-2">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="small fw-bold mb-1" style={{ color: '#475569', fontSize: '0.8rem' }}>ชื่อจริง</Form.Label>
                      <Form.Control
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        placeholder="กรอกชื่อจริง"
                        className="py-1 rounded-3"
                        style={{ background: '#f8fafc', border: '1px solid #e2e8f0', fontSize: '0.9rem' }}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="small fw-bold mb-1" style={{ color: '#475569', fontSize: '0.8rem' }}>นามสกุล</Form.Label>
                      <Form.Control
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        placeholder="กรอกนามสกุล"
                        className="py-1 rounded-3"
                        style={{ background: '#f8fafc', border: '1px solid #e2e8f0', fontSize: '0.9rem' }}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label className="small fw-bold mb-1" style={{ color: '#475569', fontSize: '0.8rem' }}>เบอร์โทรศัพท์</Form.Label>
                      <Form.Control
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        maxLength={10}
                        placeholder="0xx-xxx-xxxx"
                        className="py-1 rounded-3 fw-bold"
                        style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#4f46e5', fontSize: '0.9rem' }}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label className="small fw-bold mb-1 d-flex align-items-center gap-1" style={{ color: '#475569', fontSize: '0.8rem' }}>
                        <FaMapMarkerAlt size={11} style={{ color: '#6366f1' }}/> ที่อยู่
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        name="address"
                        rows={2}
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="กรอกที่อยู่ (ดึงจากโปรไฟล์อัตโนมัติ)"
                        className="rounded-3"
                        style={{ background: '#f8fafc', border: '1px solid #e2e8f0', fontSize: '0.85rem', resize: 'none' }}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* วิธีการจัดส่ง */}
            <Card className="border-0 rounded-4 overflow-hidden mb-3" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
              <div className="py-2 px-4 d-flex align-items-center"
                   style={{ background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 50%, #fff 100%)', borderBottom: '1px solid #a7f3d0' }}>
                <div className="d-flex align-items-center justify-content-center rounded-circle me-3"
                     style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #34d399, #059669)', boxShadow: '0 2px 8px rgba(5,150,105,0.25)' }}>
                  <FaTruck size={12} className="text-white"/>
                </div>
                <h6 className="mb-0 fw-bold text-dark">วิธีการจัดส่ง</h6>
              </div>
              <Card.Body className="p-3 px-4">
                <div className="d-flex gap-3">
                  {/* จัดส่งพัสดุ */}
                  <button
                    type="button"
                    className="btn-bounce flex-grow-1 p-2 pt-3 pb-2 rounded-4 text-center border-0"
                    style={{
                      background: formData.isShipping
                        ? 'linear-gradient(135deg, #eef2ff, #e0e7ff)'
                        : '#f8fafc',
                      border: formData.isShipping ? '2px solid #818cf8' : '2px solid #e2e8f0',
                      boxShadow: formData.isShipping ? '0 4px 16px rgba(99,102,241,0.15)' : '0 1px 4px rgba(0,0,0,0.04)',
                      cursor: 'pointer',
                      transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)'
                    }}
                    onClick={() => setFormData(prev => ({ ...prev, isShipping: true }))}
                  >
                    <div className="d-flex align-items-center justify-content-center mb-1">
                      <div className="d-flex align-items-center justify-content-center rounded-circle"
                           style={{
                             width: 36, height: 36,
                             background: formData.isShipping ? 'linear-gradient(135deg, #818cf8, #4f46e5)' : '#e2e8f0',
                             boxShadow: formData.isShipping ? '0 2px 8px rgba(99,102,241,0.3)' : 'none',
                             transition: 'all 0.25s'
                           }}>
                        <FaTruck size={14} style={{ color: formData.isShipping ? '#fff' : '#94a3b8' }}/>
                      </div>
                    </div>
                    <div className="fw-bold" style={{ color: formData.isShipping ? '#4f46e5' : '#64748b', fontSize: '0.85rem' }}>จัดส่งพัสดุ</div>
                    <small style={{ color: formData.isShipping ? '#6366f1' : '#94a3b8', fontSize: '0.75rem' }}>+50 บาท</small>
                  </button>

                  {/* รับเอง */}
                  <button
                    type="button"
                    className="btn-bounce flex-grow-1 p-2 pt-3 pb-2 rounded-4 text-center border-0"
                    style={{
                      background: !formData.isShipping
                        ? 'linear-gradient(135deg, #ecfdf5, #d1fae5)'
                        : '#f8fafc',
                      border: !formData.isShipping ? '2px solid #34d399' : '2px solid #e2e8f0',
                      boxShadow: !formData.isShipping ? '0 4px 16px rgba(5,150,105,0.15)' : '0 1px 4px rgba(0,0,0,0.04)',
                      cursor: 'pointer',
                      transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)'
                    }}
                    onClick={() => setFormData(prev => ({ ...prev, isShipping: false }))}
                  >
                    <div className="d-flex align-items-center justify-content-center mb-1">
                      <div className="d-flex align-items-center justify-content-center rounded-circle"
                           style={{
                             width: 36, height: 36,
                             background: !formData.isShipping ? 'linear-gradient(135deg, #34d399, #059669)' : '#e2e8f0',
                             boxShadow: !formData.isShipping ? '0 2px 8px rgba(5,150,105,0.3)' : 'none',
                             transition: 'all 0.25s'
                           }}>
                        <FaStore size={14} style={{ color: !formData.isShipping ? '#fff' : '#94a3b8' }}/>
                      </div>
                    </div>
                    <div className="fw-bold" style={{ color: !formData.isShipping ? '#059669' : '#64748b', fontSize: '0.85rem' }}>รับเอง</div>
                    <small style={{ color: !formData.isShipping ? '#10b981' : '#94a3b8', fontSize: '0.75rem' }}>ฟรี (ม.ราชภัฏศรีสะเกษ)</small>
                  </button>
                </div>

                {formData.isShipping && shippingCost > 0 && (
                  <div className="mt-2 d-flex align-items-center gap-2 px-3 py-2 rounded-3"
                       style={{ background: 'linear-gradient(135deg, #fefce8, #fef9c3)', border: '1px solid #fde68a' }}>
                    <FaTruck size={11} style={{ color: '#d97706' }}/>
                    <small className="fw-semibold" style={{ color: '#92400e', fontSize: '0.78rem' }}>
                      ค่าจัดส่ง: ฿{shippingCost} ({cartCount} ชิ้น)
                    </small>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>

          {/* Right: สรุปยอด */}
          <Col lg={5}>
            <Card className="border-0 rounded-4 overflow-hidden sticky-top" style={{ top: '70px', boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
              {/* Header */}
              <div className="py-2 px-4"
                   style={{ background: 'linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #fff 100%)', borderBottom: '1px solid #e0e7ff' }}>
                <h6 className="fw-bold mb-0 text-dark d-flex align-items-center gap-2">
                  <div className="d-flex align-items-center justify-content-center rounded-circle"
                       style={{ width: 28, height: 28, background: 'linear-gradient(135deg, #818cf8, #4f46e5)', boxShadow: '0 2px 8px rgba(99,102,241,0.25)' }}>
                    <FaClipboardList size={11} className="text-white"/>
                  </div>
                  สรุปรายการ
                </h6>
              </div>

              {/* Body */}
              <div className="p-3 px-4">
                {/* รายการสินค้า */}
                <div className="mb-3" style={{ maxHeight: '180px', overflowY: 'auto' }}>
                  {cart.map((item, idx) => (
                    <div key={item.uniqueKey}
                         className="d-flex justify-content-between align-items-center p-2 px-3 rounded-3 mb-1"
                         style={{ background: idx % 2 === 0 ? '#ffffff' : '#f8fafc', border: '1px solid #f1f5f9' }}>
                      <div>
                        <div className="fw-bold text-dark" style={{ fontSize: '0.82rem' }}>{item.name}</div>
                        <div className="d-flex align-items-center gap-2">
                          <span className="fw-semibold px-2 rounded-pill"
                                style={{ fontSize: '0.62rem', background: 'linear-gradient(135deg, #eef2ff, #e0e7ff)', color: '#4f46e5', border: '1px solid #c7d2fe' }}>
                            ไซส์ {item.size}
                          </span>
                          <span className="text-muted" style={{ fontSize: '0.72rem' }}>x{item.quantity}</span>
                        </div>
                      </div>
                      <div className="fw-bold" style={{ color: '#4f46e5', fontSize: '0.85rem' }}>฿{(item.price * item.quantity).toLocaleString()}</div>
                    </div>
                  ))}
                </div>

                {/* ยอดรวม */}
                <div className="d-flex justify-content-between mb-1 align-items-center">
                  <span className="text-secondary" style={{ fontSize: '0.85rem' }}>ยอดรวมสินค้า</span>
                  <span className="fw-bold text-dark" style={{ fontSize: '0.9rem' }}>฿{cartTotal.toLocaleString()}</span>
                </div>
                <div className="d-flex justify-content-between mb-2 align-items-center">
                  <span className="text-secondary" style={{ fontSize: '0.85rem' }}>ค่าจัดส่ง</span>
                  <span className="fw-semibold" style={{ color: shippingCost > 0 ? '#d97706' : '#059669', fontSize: '0.9rem' }}>
                    {shippingCost > 0 ? `฿${shippingCost}` : 'ฟรี'}
                  </span>
                </div>

                {/* ยอดสุทธิ */}
                <div className="rounded-3 p-2 px-3 mb-3"
                     style={{ background: 'linear-gradient(135deg, #eef2ff, #e0e7ff)', border: '1px solid #c7d2fe' }}>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold text-dark">ยอดสุทธิ</span>
                    <span className="fw-bold fs-4" style={{ color: '#4f46e5' }}>฿{grandTotal.toLocaleString()}</span>
                  </div>
                </div>

                {error && (
                  <Alert variant="danger" className="rounded-3 small py-2 d-flex align-items-center gap-2 mb-3" style={{ border: '1px solid #fecaca', background: '#fef2f2' }}>
                    <span style={{ color: '#dc2626' }}>{error}</span>
                  </Alert>
                )}

                {/* ปุ่มยืนยัน */}
                <button
                  type="submit"
                  className="btn-bounce w-100 border-0 py-2 rounded-pill fw-bold text-white d-flex align-items-center justify-content-center gap-2"
                  style={{
                    background: submitting ? '#94a3b8' : 'linear-gradient(135deg, #818cf8, #4f46e5)',
                    boxShadow: submitting ? 'none' : '0 4px 16px rgba(99,102,241,0.3)',
                    fontSize: '0.95rem',
                    cursor: submitting ? 'not-allowed' : 'pointer'
                  }}
                  disabled={submitting}
                >
                  {submitting ? (
                    <Spinner size="sm" />
                  ) : (
                    <>
                      <FaCheckCircle size={15}/> ยืนยันการสั่งซื้อ
                    </>
                  )}
                </button>

                {/* กลับไปแก้ไขตะกร้า */}
                <div className="text-center mt-2">
                  <button
                    type="button"
                    className="btn-bounce border-0 bg-transparent fw-semibold d-inline-flex align-items-center gap-1"
                    style={{ color: '#6366f1', fontSize: '0.8rem' }}
                    onClick={() => router.push('/cart')}
                  >
                    <FaShoppingCart size={11}/> กลับไปแก้ไขตะกร้า
                  </button>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}
