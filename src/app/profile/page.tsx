'use client';

import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Container, Card, Form, Button, Spinner, Alert } from 'react-bootstrap';
import { FaUser, FaPhoneAlt, FaSave, FaArrowLeft, FaEnvelope, FaCamera, FaTimes, FaTrash, FaExclamationTriangle } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import API_ENDPOINTS from '@/lib/api';
import AddressForm, { AddressData } from '@/components/AddressForm';

const FALLBACK_AVATAR = (seed: string) =>
  `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(seed)}&backgroundColor=c0aede,d1d4f9,b6e3f4,ffd5dc,ffdfbf`;

const emptyAddress: AddressData = { houseNo: '', province: '', district: '', subdistrict: '', zipcode: '' };

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [addressData, setAddressData] = useState<AddressData>(emptyAddress);
  const [profileImage, setProfileImage] = useState('');
  const [imgError, setImgError] = useState(false);
  const [addressKey, setAddressKey] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const displayImage = (() => {
    if (profileImage && !imgError) return profileImage;
    if (session?.user?.image && !imgError) return session.user.image;
    return FALLBACK_AVATAR(name || session?.user?.name || 'user');
  })();

  useEffect(() => {
    if (status === 'loading') return;
    if (status === 'unauthenticated' || !session) {
      router.push('/auth/login');
      return;
    }

    const fetchProfile = async () => {
      const accessToken = (session as any)?.accessToken;
      if (!accessToken) {
        setName(session?.user?.name || '');
        setEmail(session?.user?.email || '');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(API_ENDPOINTS.PROFILE, {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        if (res.ok) {
          const data = await res.json();
          setName(data.name || '');
          setPhone(data.phone || '');
          setEmail(data.email || '');
          if (data.profileImage) setProfileImage(data.profileImage);
          if (data.addressData) {
            setAddressData({
              houseNo: data.addressData.houseNo || '',
              province: data.addressData.province || '',
              district: data.addressData.district || '',
              subdistrict: data.addressData.subdistrict || '',
              zipcode: data.addressData.zipcode || '',
            });
          }
        } else {
          setName(session?.user?.name || '');
          setEmail(session?.user?.email || '');
        }
      } catch {
        setName(session?.user?.name || '');
        setEmail(session?.user?.email || '');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [session, status]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('กรุณาเลือกไฟล์รูปภาพเท่านั้น');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('ขนาดรูปต้องไม่เกิน 2MB');
      return;
    }

    const accessToken = (session as any)?.accessToken;
    if (!accessToken) {
      setError('กรุณาเข้าสู่ระบบใหม่');
      return;
    }

    setUploading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch(API_ENDPOINTS.PROFILE_UPLOAD_IMAGE, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${accessToken}` },
        body: formData
      });

      const data = await res.json();
      if (res.ok && data.profileImage) {
        setProfileImage(data.profileImage);
        setImgError(false);
        setSuccess('อัปโหลดรูปโปรไฟล์เรียบร้อย');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'อัปโหลดรูปไม่สำเร็จ');
      }
    } catch {
      setError('เกิดข้อผิดพลาดในการอัปโหลด');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 10) setPhone(value);
  };

  const handleAddressChange = useCallback((data: AddressData) => {
    setAddressData(data);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const accessToken = (session as any)?.accessToken;
    if (!accessToken) {
      setError('ไม่สามารถบันทึกได้ กรุณาเข้าสู่ระบบใหม่');
      return;
    }

    const fullAddress = [
      addressData.houseNo,
      addressData.subdistrict ? `ต.${addressData.subdistrict}` : '',
      addressData.district ? `อ.${addressData.district}` : '',
      addressData.province ? `จ.${addressData.province}` : '',
      addressData.zipcode,
    ].filter(Boolean).join(' ');

    setSaving(true);
    try {
      const res = await fetch(API_ENDPOINTS.PROFILE, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ name, phone, address: fullAddress, addressData })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'บันทึกไม่สำเร็จ');
      } else {
        setSuccess('บันทึกข้อมูลเรียบร้อยแล้ว');
        setAddressKey(k => k + 1);
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch {
      setError('เกิดข้อผิดพลาด กรุณาลองใหม่');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    const accessToken = (session as any)?.accessToken;
    if (!accessToken) return;

    setDeleting(true);
    setError('');
    try {
      const res = await fetch(API_ENDPOINTS.PROFILE, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'ลบบัญชีไม่สำเร็จ');
        setShowDeleteConfirm(false);
      } else {
        signOut({ callbackUrl: '/auth/login' });
      }
    } catch {
      setError('เกิดข้อผิดพลาด กรุณาลองใหม่');
      setShowDeleteConfirm(false);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" variant="primary" />
        <span className="ms-3 text-primary fw-bold">กำลังโหลดข้อมูล...</span>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '80px', paddingTop: '60px' }}>
      <Container style={{ maxWidth: '600px' }}>

        <Card className="border-0 rounded-4 overflow-hidden" style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)' }}>
          <div className="position-relative" style={{ background: 'linear-gradient(180deg, #f0f4ff 0%, #ffffff 100%)' }}>
            <div className="d-flex justify-content-between align-items-center px-3 pt-3 position-relative" style={{ zIndex: 2 }}>
              <Link
                href="/dashboard"
                className="btn-bounce btn-bounce-back text-decoration-none d-inline-flex align-items-center gap-1 rounded-pill px-3 py-1"
                style={{ background: '#fff', color: '#6366f1', fontSize: '0.82rem', fontWeight: 600, boxShadow: '0 2px 8px rgba(99,102,241,0.12)', border: '1px solid #e0e7ff' }}
              >
                <FaArrowLeft size={11} /> กลับ
              </Link>
              <Link
                href="/dashboard"
                className="btn-bounce btn-bounce-close d-flex align-items-center justify-content-center rounded-circle text-decoration-none"
                style={{ background: '#fff', color: '#ef4444', width: 32, height: 32, boxShadow: '0 2px 8px rgba(239,68,68,0.12)', border: '1px solid #fecaca' }}
              >
                <FaTimes size={13} />
              </Link>
            </div>
            <div className="text-center position-relative pb-4 pt-3" style={{ zIndex: 1 }}>
              <div className="d-inline-block position-relative">
                <div className="rounded-circle mb-2" style={{ padding: 3, background: 'linear-gradient(135deg, #c7d2fe, #e0e7ff, #ddd6fe)', boxShadow: '0 4px 16px rgba(99,102,241,0.15)' }}>
                  <Image
                    src={displayImage}
                    alt="Profile"
                    width={80}
                    height={80}
                    className="rounded-circle border border-3 border-white"
                    style={{ objectFit: 'cover' }}
                    unoptimized
                    onError={() => setImgError(true)}
                  />
                </div>
                <button
                  type="button"
                  className="btn-bounce btn-bounce-camera position-absolute bottom-0 end-0 btn rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: 32, height: 32, padding: 0, background: '#fff', boxShadow: '0 2px 8px rgba(99,102,241,0.2)', border: '2px solid #e0e7ff' }}
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? <Spinner size="sm" animation="border" style={{ width: 14, height: 14 }} /> : <FaCamera size={12} style={{ color: '#6366f1' }} />}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="d-none"
                  onChange={handleImageUpload}
                />
              </div>
              <h5 className="fw-bold mb-1" style={{ color: '#1e293b' }}>{name || 'สมาชิก'}</h5>
              {email && <small style={{ color: '#94a3b8' }}>{email}</small>}
            </div>
          </div>

          <Card.Body className="p-4">
            {success && (
              <Alert variant="success" className="py-2 text-center small border-0 bg-success bg-opacity-10 text-success rounded-3 mb-3">
                {success}
              </Alert>
            )}
            {error && (
              <Alert variant="danger" className="py-2 text-center small border-0 bg-danger bg-opacity-10 text-danger rounded-3 mb-3">
                {error}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold text-secondary small"><FaUser className="me-2" />ชื่อที่แสดง</Form.Label>
                <Form.Control
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="ชื่อ-นามสกุล"
                  className="rounded-3 py-2"
                />
              </Form.Group>

              {email && (
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold text-secondary small"><FaEnvelope className="me-2" />อีเมล</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    disabled
                    className="rounded-3 py-2 bg-light"
                  />
                </Form.Group>
              )}

              <Form.Group className="mb-3">
                <Form.Label className="fw-bold text-secondary small"><FaPhoneAlt className="me-2" />เบอร์โทรศัพท์</Form.Label>
                <Form.Control
                  type="tel"
                  inputMode="numeric"
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="0xx-xxx-xxxx"
                  maxLength={10}
                  className="rounded-3 py-2"
                />
              </Form.Group>

              <hr className="my-4 border-secondary opacity-10" />

              <AddressForm key={addressKey} value={addressData} onChange={handleAddressChange} />

              <Button
                type="submit"
                className="w-100 py-3 rounded-3 fw-bold shadow-sm border-0 btn-gradient-primary hover-lift mt-3"
                disabled={saving}
              >
                {saving ? <Spinner size="sm" animation="border" /> : <><FaSave className="me-2" /> บันทึกข้อมูล</>}
              </Button>
            </Form>

            {(session?.user as any)?.role !== 'admin' && (<>
            <hr className="my-4 border-danger opacity-15" />

            {/* Danger Zone */}
            <div className="rounded-3 p-3" style={{ background: 'linear-gradient(135deg, #fef2f2, #fff5f5)', border: '1px solid #fecaca' }}>
              <h6 className="fw-bold mb-2 d-flex align-items-center gap-2" style={{ color: '#dc2626', fontSize: '0.85rem' }}>
                <FaExclamationTriangle size={13} /> โซนอันตราย
              </h6>

              {!showDeleteConfirm ? (
                <button
                  type="button"
                  className="btn-bounce w-100 border-0 rounded-3 py-2 fw-semibold d-flex align-items-center justify-content-center gap-2"
                  style={{ background: 'linear-gradient(135deg, #fee2e2, #fecaca)', color: '#dc2626', fontSize: '0.85rem' }}
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <FaTrash size={12} /> ลบบัญชีของฉัน
                </button>
              ) : (
                <div className="rounded-3 p-3" style={{ background: '#fff', border: '1px solid #fca5a5' }}>
                  <p className="mb-3 small" style={{ color: '#991b1b', lineHeight: 1.6 }}>
                    การลบบัญชีจะไม่สามารถกู้คืนได้ ข้อมูลทั้งหมดจะถูกลบอย่างถาวร
                  </p>
                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className="btn-bounce flex-grow-1 border-0 rounded-3 py-2 fw-bold text-white d-flex align-items-center justify-content-center gap-2"
                      style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)', boxShadow: '0 2px 8px rgba(239,68,68,0.3)', fontSize: '0.85rem' }}
                      onClick={handleDeleteAccount}
                      disabled={deleting}
                    >
                      {deleting ? <Spinner size="sm" animation="border" /> : <><FaTrash size={11} /> ยืนยันลบบัญชี</>}
                    </button>
                    <button
                      type="button"
                      className="btn-bounce border-0 rounded-3 py-2 fw-semibold px-3"
                      style={{ background: '#f1f5f9', color: '#64748b', fontSize: '0.85rem' }}
                      onClick={() => setShowDeleteConfirm(false)}
                      disabled={deleting}
                    >
                      ยกเลิก
                    </button>
                  </div>
                </div>
              )}
            </div>
            </>)}
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}
