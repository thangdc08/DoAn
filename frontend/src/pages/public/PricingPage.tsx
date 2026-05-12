import React from 'react';
import { Typography, Row, Col, Card, Button, Badge, List, Space, Divider } from 'antd';
import { 
  CheckCircleFilled, 
  RocketOutlined, 
  ThunderboltOutlined, 
  CrownOutlined,
  ArrowRightOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;

const PLANS = [
  {
    name: 'Starter',
    price: 'Miễn phí',
    desc: 'Hoàn hảo cho các sân mới bắt đầu chuyển đổi số.',
    icon: <RocketOutlined />,
    color: '#94a3b8',
    features: [
      'Quản lý tối đa 2 sân',
      'Lịch đặt sân cơ bản',
      'Báo cáo doanh thu tuần',
      'Hỗ trợ qua Email',
      'Tích hợp bản đồ cơ bản'
    ],
    cta: 'Bắt đầu ngay',
    popular: false
  },
  {
    name: 'Professional',
    price: '499.000đ',
    period: '/ tháng',
    desc: 'Giải pháp toàn diện cho các CLB chuyên nghiệp.',
    icon: <ThunderboltOutlined />,
    color: '#10b981',
    features: [
      'Không giới hạn số lượng sân',
      'Lịch đặt sân thông minh',
      'Báo cáo AI & Dự báo doanh thu',
      'Hỗ trợ ưu tiên 24/7',
      'Quản lý thành viên & Thẻ thành viên',
      'Tích hợp thanh toán tự động'
    ],
    cta: 'Dùng thử miễn phí',
    popular: true
  },
  {
    name: 'Enterprise',
    price: 'Liên hệ',
    desc: 'Dành cho chuỗi hệ thống sân quy mô lớn.',
    icon: <CrownOutlined />,
    color: '#6366f1',
    features: [
      'Tất cả tính năng bản Pro',
      'Quản trị đa chi nhánh',
      'API tích hợp riêng',
      'Quản lý Marketing chuyên sâu',
      'Đội ngũ hỗ trợ kỹ thuật riêng',
      'Tùy chỉnh giao diện thương hiệu'
    ],
    cta: 'Liên hệ tư vấn',
    popular: false
  }
];

export default function PricingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-slate-900 pt-32 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
           <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/20 blur-[120px]" />
           <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/20 blur-[120px]" />
        </div>
        
        <div className="mx-auto max-w-screen-xl px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-8 animate-in fade-in slide-in-from-bottom duration-700">
             <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider">Bảng giá dịch vụ</span>
          </div>
          
          <h1 className="text-white text-4xl md:text-6xl font-black mb-6 leading-[1.1] tracking-tight">
            Lựa chọn gói dịch vụ <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              phù hợp với quy mô của bạn
            </span>
          </h1>
          
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Chúng tôi cung cấp các gói giải pháp linh hoạt giúp bạn tối ưu hóa vận hành và bứt phá doanh thu sân cầu lông.
          </p>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="py-24 bg-slate-50 relative">
        <div className="mx-auto max-w-screen-xl px-6 lg:px-8">
          <Row gutter={[32, 32]} align="middle">
            {PLANS.map((plan, i) => (
              <Col xs={24} lg={8} key={i}>
                <div className={`
                  relative bg-white rounded-[40px] p-8 md:p-10 border transition-all duration-500 group
                  ${plan.popular ? 'border-emerald-500 shadow-2xl shadow-emerald-500/10 scale-105 z-10' : 'border-slate-100 shadow-xl shadow-slate-200/50 hover:border-slate-200'}
                `}>
                  {plan.popular && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-emerald-500 text-white px-6 py-1.5 rounded-full text-sm font-bold shadow-lg">
                      PHỔ BIẾN NHẤT
                    </div>
                  )}

                  <div className="mb-8">
                    <div 
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6"
                      style={{ background: `${plan.color}15`, color: plan.color }}
                    >
                      {plan.icon}
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-2">{plan.name}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed mb-6">{plan.desc}</p>
                    
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black text-slate-900">{plan.price}</span>
                      {plan.period && <span className="text-slate-400 font-bold">{plan.period}</span>}
                    </div>
                  </div>

                  <Divider className="my-8" />

                  <div className="mb-10">
                    <Text strong className="text-xs text-slate-400 uppercase tracking-widest block mb-6">TÍNH NĂNG NỔI BẬT</Text>
                    <List
                      dataSource={plan.features}
                      renderItem={item => (
                        <List.Item className="border-none py-2 px-0">
                          <div className="flex items-start gap-3">
                            <CheckCircleFilled className="text-emerald-500 mt-1" />
                            <span className="text-slate-600 font-medium">{item}</span>
                          </div>
                        </List.Item>
                      )}
                    />
                  </div>

                  <Button 
                    type={plan.popular ? 'primary' : 'default'} 
                    size="large" 
                    block 
                    onClick={() => navigate('/partner/register')}
                    className={`
                      h-16 rounded-2xl font-bold text-lg border-none transition-all
                      ${plan.popular ? 'bg-emerald-500 shadow-xl shadow-emerald-500/20 hover:scale-[1.02]' : 'bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-900/10'}
                    `}
                  >
                    {plan.cta} <ArrowRightOutlined />
                  </Button>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      {/* FAQ Section Hint */}
      <div className="py-24 bg-white text-center">
        <div className="mx-auto max-w-2xl px-6">
          <h2 className="text-3xl font-black text-slate-900 mb-4">Câu hỏi thường gặp?</h2>
          <p className="text-slate-500 mb-10">Bạn vẫn còn băn khoăn về gói dịch vụ? Hãy để chuyên viên của chúng tôi tư vấn chi tiết cho bạn.</p>
          <Button type="link" className="text-emerald-600 font-bold text-lg hover:text-emerald-700">
            Xem giải đáp thắc mắc →
          </Button>
        </div>
      </div>
    </div>
  );
}
