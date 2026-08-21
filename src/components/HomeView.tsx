'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Container, Row, Col, Card, Carousel } from 'react-bootstrap';
import { 
  FaShoppingCart, FaTshirt,
  FaLine, FaFacebook, FaMoneyBillWave, FaChartPie, FaBoxOpen, FaRulerCombined, FaClipboardList, FaTrophy, FaChartLine
} from 'react-icons/fa';
import { Product } from '@/types';

// --- Types ---
interface StockStat {
  size: string;
  count: number;
}

interface HomeViewProps {
  products: Product[];
  stats: {
    overall: { revenue: number; itemsSold: number };
    bestSeller: { name: string; price: number; sold: number; revenue: number; imageUrl: string } | null;
  };
  sizeStatsTotal: StockStat[];
}

// --- Helper Data ---
const sizeChartData = [
  { size: 'SSS', chest: 34, length: 24 },
  { size: 'SS', chest: 36, length: 25 },
  { size: 'S', chest: 38, length: 26 },
  { size: 'M', chest: 40, length: 27 },
  { size: 'L', chest: 42, length: 28 },
  { size: 'XL', chest: 44, length: 29 },
  { size: '2XL', chest: 46, length: 30 },
  { size: '3XL', chest: 48, length: 31 },
  { size: '4XL', chest: 50, length: 32 },
  { size: '5XL', chest: 52, length: 33 },
  { size: '6XL', chest: 54, length: 34 },
  { size: '7XL', chest: 56, length: 35 },
  { size: '8XL', chest: 58, length: 36 },
  { size: '9XL', chest: 60, length: 37 },
  { size: '10XL', chest: 62, length: 38 },
];

// --- Helper Components ---
const SizeGrid = ({ data, title }: { data: StockStat[], title: string }) => {
  return (
    <div className="mb-2">
      <h6 className="fw-bold mb-3 d-flex align-items-center justify-content-between">
        <span className="badge bg-warning text-dark rounded-pill px-3 py-1 shadow-sm">{title}</span>
        <small className="text-muted fw-normal" style={{fontSize: '0.75rem'}}>อัปเดตล่าสุด (Real-time)</small>
      </h6>
      <div className="d-flex flex-wrap align-items-center gap-1">
        {data.map((item, index) => (
          <div key={index} className="stock-item-flexible border-warning text-dark bg-white" style={{borderColor: '#ffc107', minWidth: '55px'}}>
             <div className="fw-bold small text-secondary">{item.size}</div>
             <div className="fw-bold" style={{fontSize: '0.9rem'}}>
                {item.count > 0 ? item.count.toLocaleString() : <span className="text-danger text-opacity-50">-</span>}
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SmartImage = ({ src, alt, type = 'product' }: { src: string, alt: string, type?: 'product'|'qr' }) => {
  const [error, setError] = useState(false);
  if (error || !src) return <div className={`d-flex align-items-center justify-content-center text-muted bg-light rounded-3 border border-dashed ${type === 'qr' ? 'w-100 h-100' : 'w-100'}`} style={type === 'product' ? {height: '300px'} : {}}><div className="text-center opacity-50 p-2">{type === 'qr' ? <FaClipboardList size={20}/> : <FaTshirt size={40}/>}<div style={{fontSize: '0.7rem', marginTop: '5px'}}>No Image</div></div></div>;
  
  return (
    <div className={`position-relative ${type === 'qr' ? 'w-100 h-100' : 'w-100 h-100'}`}>
        <Image 
            src={src} 
            alt={alt} 
            fill 
            style={{ objectFit: 'contain', filter: type === 'product' ? 'drop-shadow(0 10px 20px rgba(0,0,0,0.1))' : 'none' }} 
            onError={() => setError(true)} 
        />
    </div>
  );
};

export default function HomeView({ products, stats, sizeStatsTotal }: HomeViewProps) {
  
  return (
    <>
      {/* Hero Section */}
      <section className="pt-3 pt-lg-5 pb-3">
        <Container>
          <div
            className="bg-white rounded-4 p-3 p-lg-5 position-relative"
            style={{ boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)', margin: '10px' }}
          >
            <Row className="align-items-center gy-4">
              <Col lg={6} className="order-2 order-lg-1">
                <h1 className="fw-bold mb-2 mb-lg-3 text-dark hero-title-responsive" style={{lineHeight: '1.2'}}>
                  ร่วมเฉลิมฉลอง<br/><span className="text-primary">เมืองศรีสะเกษ 243 ปี</span>
                </h1>
                <p className="text-secondary mb-3 mb-lg-4 fw-normal hero-desc-responsive">
                  สั่งซื้อเสื้อที่ระลึก "สู่ขวัญบ้าน บายศรีเมือง รุ่งเรือง 243 ปี"<br className="d-none d-md-block"/>
                  รายได้สมทบทุนจัดกิจกรรมสร้างสรรค์เพื่อบ้านเกิดของเรา
                </p>
                <div className="d-flex gap-3 justify-content-lg-start hero-buttons-mobile-center">
                  <Link href="/products" className="btn btn-primary fw-bold px-3 px-lg-4 py-2 py-lg-3 shadow d-inline-flex align-items-center hover-lift hero-btn-responsive">
                    <FaShoppingCart className="me-2" /> สั่งซื้อเลย
                  </Link>
                </div>
              </Col>
              <Col lg={6} className="order-1 order-lg-2">
                 <div className="w-100 position-relative hero-carousel-wrapper hero-carousel-responsive">
                    <Carousel controls={true} indicators={products.length > 1} interval={3000} touch={true} variant="dark" fade={false} className="h-100 hero-carousel-custom carousel-controls-mobile-visible">
                      {products.length > 0 ? (
                          products.map((p, idx) => (
                            <Carousel.Item key={idx} className="h-100">
                              <div className="d-flex justify-content-center align-items-center w-100 h-100">
                                <SmartImage src={p.imageUrl} alt={p.name} type="product" />
                              </div>
                            </Carousel.Item>
                          ))
                      ) : (
                        <Carousel.Item className="h-100">
                           <div className="d-flex justify-content-center align-items-center w-100 h-100">
                             <div className="text-muted bg-light rounded-circle d-flex align-items-center justify-content-center" style={{width: 200, height: 200}}>
                                <FaTshirt size={80} className="opacity-25"/>
                             </div>
                           </div>
                        </Carousel.Item>
                      )}
                    </Carousel>
                 </div>
              </Col>
            </Row>
          </div>
        </Container>
      </section>

      <Container className="pb-5">

        <div className="mb-4 mt-4">
           <Card className="shadow-sm rounded-4 overflow-hidden card-border-purple">
             <div className="card-header-gradient-purple p-3 px-4">
                <h5 className="fw-bold mb-0 text-white d-flex align-items-center"><FaChartPie className="me-2"/> ภาพรวมยอดจำหน่าย (Real-time)</h5>
             </div>
             <Card.Body className="p-4">
                <Row className="g-4">
                   <Col lg={6}>
                      <div className="p-4 h-100 rounded-4 border border-2 border-primary bg-primary bg-opacity-10 d-flex flex-column justify-content-center align-items-center text-center position-relative overflow-hidden">
                         <h6 className="text-primary fw-bold mb-2">ยอดจำหน่ายรวมทั้งหมด</h6>
                         <h1 className="fw-bold text-dark mb-0 display-5">฿{stats.overall.revenue.toLocaleString()}</h1>
                         <p className="text-secondary mb-0 mt-2">
                            จำหน่ายไปแล้ว <span className="fw-bold text-primary">{stats.overall.itemsSold.toLocaleString()}</span> ตัว
                         </p>
                      </div>
                   </Col>

                   {/* (Best Seller) */}
                   <Col lg={6}>
                      <div className="p-4 bg-white rounded-4 h-100 border border-warning shadow-sm position-relative overflow-hidden">
                         <div className="position-absolute top-0 end-0 p-3 opacity-25">
                            <FaTrophy size={80} className="text-warning"/>
                         </div>
                         
                         <h6 className="text-secondary fw-bold mb-3 position-relative z-1">
                            สินค้าขายดีอันดับ 1
                         </h6>

                         {stats.bestSeller ? (
                             <div className="d-flex align-items-center position-relative z-1">
                                <div className="me-3 flex-shrink-0" style={{width: 80, height: 80}}>
                                    <Image src={stats.bestSeller.imageUrl} alt="Best" width={80} height={80} style={{objectFit:'contain'}} />
                                </div>
                                <div>
                                    <h5 className="fw-bold text-dark mb-1">{stats.bestSeller.name}</h5>
                                    <div className="text-muted small">
                                        ยอดขาย: <span className="fw-bold text-success">฿{stats.bestSeller.revenue.toLocaleString()}</span> 
                                        <span className="mx-2">|</span>
                                        จำนวน: <span className="fw-bold text-dark">{stats.bestSeller.sold.toLocaleString()}</span> ตัว
                                    </div>
                                </div>
                             </div>
                         ) : (
                             <div className="text-center py-4 text-muted position-relative z-1">
                                 ยังไม่มีข้อมูลการขาย
                             </div>
                         )}
                      </div>
                   </Col>
                </Row>
             </Card.Body>
           </Card>
        </div>

        <Row className="g-4 mb-5">
           <Col lg={6}>
              <Card className="shadow-sm rounded-4 overflow-hidden card-border-teal h-100">
                 <div className="card-header-gradient-teal p-3 px-4">
                    <h4 className="fw-bold mb-0 d-flex align-items-center text-white"><FaRulerCombined className="me-3"/> ตารางไซส์ (Size Chart)</h4>
                 </div>
                 <Card.Body className="p-0">
                    <table className="table-custom table-striped-custom text-center mb-0 h-100">
                      <thead>
                        <tr>
                          <th>SIZE</th>
                          <th>รอบอก (นิ้ว)</th>
                          <th>ความยาว (นิ้ว)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sizeChartData.map((row, i) => (
                          <tr key={i}>
                            <td className="fw-bold text-success">{row.size}</td>
                            <td>{row.chest}</td>
                            <td className="text-muted">{row.length}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                 </Card.Body>
              </Card>
           </Col>

           {/* Stock & Payment */}
           <Col lg={6}>
              <div className="d-flex flex-column gap-4">
                  {/* Stock */}
                  <Card className="shadow-sm rounded-4 overflow-hidden card-border-orange">
                     <div className="card-header-gradient-orange p-3 px-4">
                        <h4 className="fw-bold mb-0 d-flex align-items-center text-white"><FaBoxOpen className="me-3"/> สต็อกคงเหลือ (รวมทุกสี)</h4>
                     </div>
                     <Card.Body className="p-4">
                        <SizeGrid title="ยอดรวมคงเหลือ" data={sizeStatsTotal} />
                     </Card.Body>
                  </Card>

                  {/* Payment */}
                  <Card className="shadow-sm overflow-hidden rounded-4 card-border-purple">
                     <div className="card-header-gradient-purple p-3 px-4">
                        <h4 className="fw-bold mb-0 text-white d-flex align-items-center"><FaMoneyBillWave className="me-3"/> ช่องทางชำระเงิน</h4>
                     </div>
                     <Card.Body className="p-4">
                        <div className="d-flex flex-row align-items-center gap-3 mb-4 p-3 bg-light rounded-4 border border-2 shadow-sm">
                             <div className="rounded-4 shadow-sm d-flex align-items-center justify-content-center flex-shrink-0 p-2" style={{width: 60, height: 60, backgroundColor: '#1e4598'}}>
                                <Image src="/images/bank_logos/bbl.svg" alt="Bank" width={40} height={40} style={{objectFit: 'contain'}} /> 
                             </div>
                             <div>
                                <h6 className="text-muted mb-0 small">ธนาคารกรุงเทพ</h6>
                                <h4 className="fw-bold text-primary mb-0" style={{letterSpacing: '1px'}}>333-4-23368-5</h4>
                                <small className="text-dark d-block mt-1" style={{fontSize: '0.75rem'}}>บจ. ประชารัฐรักสามัคคีศรีสะเกษ</small>
                             </div>
                        </div>
                        <div className="d-flex justify-content-between align-items-center gap-2">
                           <div className="d-flex gap-3">
                               <div className="text-center">
                                  <div className="bg-white border rounded-3 p-1 mb-1 shadow-sm" style={{width: 60, height: 60}}>
                                     <SmartImage src="/images/comsci_sskru_line.png" alt="QR" type="qr" />
                                  </div>
                                  <small className="fw-bold text-success d-block" style={{fontSize: '0.7rem'}}><FaLine/> LINE</small>
                               </div>
                               <div className="text-center">
                                  <div className="bg-white border rounded-3 p-1 mb-1 shadow-sm" style={{width: 60, height: 60}}>
                                     <SmartImage src="/images/comsci_sskru_facebook.png" alt="QR" type="qr" />
                                  </div>
                                  <small className="fw-bold text-primary d-block" style={{fontSize: '0.7rem'}}><FaFacebook/> Facebook</small>
                               </div>
                           </div>
                           <div className="text-end">
                               <h6 className="fw-bold text-secondary mb-1">สอบถามเพิ่มเติม</h6>
                               <a href="tel:0933581622" className="text-decoration-none text-dark fw-bold fs-5 d-block">012-345-6789</a>
                           </div>
                        </div>
                     </Card.Body>
                  </Card>
              </div>
           </Col>
        </Row>

      </Container>
    </>
  );
}