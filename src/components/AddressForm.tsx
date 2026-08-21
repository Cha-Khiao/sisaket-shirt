'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Form } from 'react-bootstrap';
import { FaMapMarkerAlt, FaSearch, FaEdit, FaCheckCircle } from 'react-icons/fa';
import {
  loadAddressData,
  searchProvinces,
  searchDistricts,
  searchSubdistricts,
  getZipcode,
  searchByZipcode,
} from '@/lib/thai-address';

export interface AddressData {
  houseNo: string;
  province: string;
  district: string;
  subdistrict: string;
  zipcode: string;
}

interface Props {
  value: AddressData;
  onChange: (data: AddressData) => void;
}

function AutocompleteField({
  label,
  icon,
  placeholder,
  value,
  suggestions,
  onSelect,
  onClear,
  disabled,
}: {
  label: string;
  icon?: React.ReactNode;
  placeholder: string;
  value: string;
  suggestions: string[];
  onSelect: (v: string) => void;
  onClear?: () => void;
  disabled?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const [query, setQuery] = useState(value);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef(false);

  useEffect(() => {
    if (!focused) setQuery(value);
  }, [value, focused]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        if (focused && !selectedRef.current && query.trim() === '' && value) {
          onClear?.();
        }
        setFocused(false);
        selectedRef.current = false;
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [focused, query, value, onClear]);

  const filtered = query.length > 0
    ? suggestions.filter(s => s.includes(query))
    : [];

  const showDropdown = focused && filtered.length > 0;

  return (
    <Form.Group className="mb-3" ref={wrapperRef}>
      <Form.Label className="fw-bold text-secondary small">
        {icon && <span className="me-2">{icon}</span>}
        {label}
      </Form.Label>
      <div className="position-relative">
        <Form.Control
          type="text"
          value={focused ? query : value}
          placeholder={placeholder}
          className="rounded-3 py-2"
          disabled={disabled}
          onFocus={() => {
            setFocused(true);
            setQuery(value);
            selectedRef.current = false;
          }}
          onChange={(e) => setQuery(e.target.value)}
          autoComplete="off"
        />
        {!disabled && (
          <FaSearch
            size={12}
            className="position-absolute text-muted"
            style={{ right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
          />
        )}
        {showDropdown && (
          <div
            className="position-absolute w-100 bg-white border rounded-3 shadow-lg overflow-auto"
            style={{ maxHeight: 200, zIndex: 1050, top: '100%', marginTop: 4 }}
          >
            {filtered.slice(0, 50).map((item) => (
              <button
                key={item}
                type="button"
                className="dropdown-item px-3 py-2 small border-0 bg-transparent text-start w-100"
                style={{ cursor: 'pointer' }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  selectedRef.current = true;
                  onSelect(item);
                  setQuery(item);
                  setFocused(false);
                }}
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </div>
    </Form.Group>
  );
}

function hasAddress(data: AddressData): boolean {
  return !!(data.province && data.district && data.subdistrict);
}

function formatAddress(data: AddressData): string {
  return [
    data.houseNo,
    data.subdistrict ? `ต.${data.subdistrict}` : '',
    data.district ? `อ.${data.district}` : '',
    data.province ? `จ.${data.province}` : '',
    data.zipcode,
  ].filter(Boolean).join(' ');
}

export default function AddressForm({ value, onChange }: Props) {
  const [editing, setEditing] = useState(!hasAddress(value));
  const [provinces, setProvinces] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [subdistricts, setSubdistricts] = useState<string[]>([]);

  useEffect(() => {
    setEditing(!hasAddress(value));
  }, []);

  useEffect(() => {
    if (!editing) return;
    loadAddressData().then(() => {
      setProvinces(searchProvinces(''));
    });
  }, [editing]);

  useEffect(() => {
    if (value.province) {
      setDistricts(searchDistricts(value.province, ''));
    } else {
      setDistricts([]);
    }
  }, [value.province]);

  useEffect(() => {
    if (value.province && value.district) {
      setSubdistricts(searchSubdistricts(value.province, value.district, ''));
    } else {
      setSubdistricts([]);
    }
  }, [value.province, value.district]);

  const update = useCallback(
    (patch: Partial<AddressData>) => onChange({ ...value, ...patch }),
    [value, onChange]
  );

  const handleProvinceSelect = (province: string) => {
    update({ province, district: '', subdistrict: '', zipcode: '' });
  };

  const handleDistrictSelect = (district: string) => {
    update({ district, subdistrict: '', zipcode: '' });
  };

  const handleSubdistrictSelect = (subdistrict: string) => {
    const zip = getZipcode(value.province, value.district, subdistrict);
    update({ subdistrict, zipcode: zip });
  };

  const handleZipcodeChange = (zipcode: string) => {
    const cleaned = zipcode.replace(/\D/g, '').slice(0, 5);
    update({ zipcode: cleaned });

    if (cleaned.length === 5) {
      const results = searchByZipcode(cleaned);
      if (results.length > 0) {
        const first = results[0];
        const uniqueProvinces = [...new Set(results.map(r => r.province))];
        if (uniqueProvinces.length === 1) {
          update({
            zipcode: cleaned,
            province: first.province,
            district: results.length === 1 ? first.district : value.district,
            subdistrict: results.length === 1 ? first.subdistrict : value.subdistrict,
          });
        }
      }
    }
  };

  if (!editing && hasAddress(value)) {
    return (
      <div>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <Form.Label className="fw-bold text-secondary small mb-0">
            <FaMapMarkerAlt className="me-2" />ที่อยู่จัดส่ง
          </Form.Label>
          <button
            type="button"
            className="btn btn-sm btn-outline-primary rounded-pill px-3 py-1"
            onClick={() => setEditing(true)}
          >
            <FaEdit className="me-1" size={11} /> แก้ไข
          </button>
        </div>
        <div className="bg-light rounded-3 p-3 border">
          <div className="d-flex align-items-start gap-2">
            <FaCheckCircle className="text-success mt-1 flex-shrink-0" size={14} />
            <span className="small text-dark">{formatAddress(value)}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Form.Label className="fw-bold text-secondary small mb-0">
          <FaMapMarkerAlt className="me-2" />ที่อยู่จัดส่ง
        </Form.Label>
        {hasAddress(value) && (
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary rounded-pill px-3 py-1"
            onClick={() => setEditing(false)}
          >
            ยกเลิก
          </button>
        )}
      </div>

      <Form.Group className="mb-3">
        <Form.Label className="text-muted small">บ้านเลขที่ / ซอย / ถนน</Form.Label>
        <Form.Control
          type="text"
          value={value.houseNo}
          onChange={(e) => update({ houseNo: e.target.value })}
          placeholder="เช่น 123/4 ซ.สุขุมวิท 55 ถ.สุขุมวิท"
          className="rounded-3 py-2"
        />
      </Form.Group>

      <AutocompleteField
        label="จังหวัด"
        placeholder="พิมพ์ค้นหาจังหวัด..."
        value={value.province}
        suggestions={provinces}
        onSelect={handleProvinceSelect}
        onClear={() => update({ province: '', district: '', subdistrict: '', zipcode: '' })}
      />

      <AutocompleteField
        label="อำเภอ / เขต"
        placeholder={value.province ? 'พิมพ์ค้นหาอำเภอ...' : 'เลือกจังหวัดก่อน'}
        value={value.district}
        suggestions={districts}
        onSelect={handleDistrictSelect}
        onClear={() => update({ district: '', subdistrict: '', zipcode: '' })}
        disabled={!value.province}
      />

      <AutocompleteField
        label="ตำบล / แขวง"
        placeholder={value.district ? 'พิมพ์ค้นหาตำบล...' : 'เลือกอำเภอก่อน'}
        value={value.subdistrict}
        suggestions={subdistricts}
        onSelect={handleSubdistrictSelect}
        onClear={() => update({ subdistrict: '', zipcode: '' })}
        disabled={!value.district}
      />

      <Form.Group className="mb-3">
        <Form.Label className="text-muted small">รหัสไปรษณีย์</Form.Label>
        <Form.Control
          type="tel"
          inputMode="numeric"
          value={value.zipcode}
          onChange={(e) => handleZipcodeChange(e.target.value)}
          placeholder="เช่น 33000"
          maxLength={5}
          className="rounded-3 py-2"
        />
        <Form.Text className="text-muted" style={{ fontSize: '0.7rem' }}>
          กรอกรหัสไปรษณีย์เพื่อค้นหาจังหวัด อำเภอ ตำบล อัตโนมัติ
        </Form.Text>
      </Form.Group>
    </div>
  );
}
