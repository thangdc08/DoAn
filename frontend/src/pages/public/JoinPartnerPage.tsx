import React from 'react';
import { Row, Col, Card, Button, Divider } from 'antd';
import { 
  ShopOutlined, 
  LineChartOutlined, 
  CustomerServiceOutlined,
  UserOutlined,
  ArrowRightOutlined,
  ThunderboltOutlined,
  SafetyCertificateOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const BENEFITS = [
  {
    title: 'Tiếp cận khách hàng',
    desc: 'Hàng ngàn người chơi tìm kiếm sân mỗi ngày trên hệ thống của chúng tôi.',
    icon: <UserOutlined />,
    color: '#10b981'
  },
  {
    title: 'Quản lý thông minh',
    desc: 'Công cụ đặt lịch, thanh toán và báo cáo doanh thu tự động, chính xác.',
    icon: <LineChartOutlined />,
    color: '#3b82f6'
  },
  {
    title: 'Hỗ trợ 24/7',
    desc: 'Đội ngũ kỹ thuật và CSKH luôn sẵn sàng đồng hành cùng bạn.',
    icon: <CustomerServiceOutlined />,
    color: '#6366f1'
  },
  {
    title: 'Tối ưu doanh thu',
    desc: 'Tối ưu hóa công suất sân và giảm thiểu tình trạng bỏ lịch.',
    icon: <ThunderboltOutlined />,
    color: '#f59e0b'
  }
];

export default function JoinPartnerPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="bg-slate-900 pt-32 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
           <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/20 blur-[120px]" />
           <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/20 blur-[120px]" />
        </div>
        
        <div className="mx-auto max-w-screen-xl px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-8 animate-in fade-in slide-in-from-bottom duration-700">
             <SafetyCertificateOutlined className="text-emerald-400" />
             <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider">Hợp tác tin cậy cùng BadmintonHub</span>
          </div>
          
          <h1 className="text-white text-4xl md:text-6xl font-black mb-6 leading-[1.1] tracking-tight">
            Kinh doanh sân cầu lông <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              hiệu quả & chuyên nghiệp
            </span>
          </h1>
          
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Giải pháp công nghệ toàn diện giúp bạn quản lý lịch đặt, thanh toán và khách hàng chỉ trong một nền tảng duy nhất.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              type="primary" 
              size="large" 
              icon={<ArrowRightOutlined />} 
              onClick={() => navigate('/partner/register')}
              className="h-14 px-10 rounded-2xl bg-emerald-500 border-none font-bold text-base shadow-xl shadow-emerald-500/20 hover:scale-105 transition-transform"
            >
              Đăng ký ngay bây giờ
            </Button>
            <Button 
              ghost 
              size="large" 
              className="h-14 px-10 rounded-2xl border-slate-700 text-white font-bold hover:bg-white/5"
            >
              Tìm hiểu thêm
            </Button>
          </div>
        </div>
      </div>

      {/* Benefits Grid */}
      <div className="py-24 bg-slate-50 border-y border-slate-100">
        <div className="mx-auto max-w-screen-xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-slate-900 mb-4">Lợi thế khi hợp tác cùng chúng tôi</h2>
            <div className="h-1.5 w-20 bg-emerald-500 mx-auto rounded-full" />
          </div>
          
          <Row gutter={[32, 32]}>
            {BENEFITS.map((b, i) => (
              <Col xs={24} sm={12} lg={6} key={i}>
                <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6 transition-colors" 
                    style={{ background: `${b.color}10`, color: b.color }}
                  >
                    {b.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{b.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{b.desc}</p>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </div>

    </div>
  );
}
