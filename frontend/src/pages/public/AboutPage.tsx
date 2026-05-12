import React from 'react';
import { Typography, Row, Col, Card, Button, Divider, Space } from 'antd';
import { 
  HeartOutlined, 
  SafetyCertificateOutlined, 
  TeamOutlined, 
  GlobalOutlined,
  TrophyOutlined,
  RocketOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;

const STATS = [
  { label: 'Người dùng', value: '50,000+', icon: <TeamOutlined />, color: '#10b981' },
  { label: 'Sân cầu lông', value: '500+', icon: <SafetyCertificateOutlined />, color: '#3b82f6' },
  { label: 'Thành phố', value: '20+', icon: <GlobalOutlined />, color: '#f59e0b' },
  { label: 'Trận đấu/tháng', value: '100k+', icon: <TrophyOutlined />, color: '#ef4444' }
];

const VALUES = [
  {
    title: 'Đam mê thể thao',
    desc: 'Chúng tôi bắt đầu từ tình yêu với bộ môn cầu lông và mong muốn xây dựng cộng đồng vững mạnh.',
    icon: <HeartOutlined />
  },
  {
    title: 'Công nghệ tiên phong',
    desc: 'Số hóa hoàn toàn quy trình đặt sân và quản lý, giúp mọi thứ trở nên minh bạch và dễ dàng.',
    icon: <RocketOutlined />
  },
  {
    title: 'Kết nối cộng đồng',
    desc: 'Không chỉ là đặt sân, chúng tôi tạo ra nơi để những người chơi giao lưu và học hỏi.',
    icon: <TeamOutlined />
  }
];

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-slate-900 pt-32 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
           <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_30%,#10b981_0,transparent_50%)]" />
        </div>
        
        <div className="mx-auto max-w-screen-xl px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-8 animate-in fade-in duration-700">
             <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider">Về chúng tôi</span>
          </div>
          
          <h1 className="text-white text-4xl md:text-6xl font-black mb-6 leading-[1.1] tracking-tight">
            Nâng tầm trải nghiệm <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              thể thao cộng đồng
            </span>
          </h1>
          
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            BadmintonHub là nền tảng số hóa sân cầu lông hàng đầu, kết nối hàng ngàn người chơi với những địa điểm tập luyện chất lượng nhất.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-white border-b border-slate-100">
        <div className="mx-auto max-w-screen-xl px-6 lg:px-8">
          <Row gutter={[32, 32]}>
            {STATS.map((stat, i) => (
              <Col xs={12} md={6} key={i}>
                <div className="text-center p-6">
                  <div className="text-3xl mb-4" style={{ color: stat.color }}>{stat.icon}</div>
                  <div className="text-3xl font-black text-slate-900 mb-1">{stat.value}</div>
                  <div className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">{stat.label}</div>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="py-24 bg-slate-50">
        <div className="mx-auto max-w-screen-xl px-6 lg:px-8">
          <Row gutter={[64, 64]} align="middle">
            <Col xs={24} lg={12}>
               <div className="relative">
                  <div className="aspect-square bg-slate-200 rounded-[64px] overflow-hidden shadow-2xl rotate-3 transition-transform hover:rotate-0 duration-500">
                     <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-indigo-500/20" />
                     {/* Placeholder for About Image */}
                     <div className="flex items-center justify-center h-full text-9xl">🏸</div>
                  </div>
                  <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-white p-8 rounded-[32px] shadow-2xl hidden md:block animate-bounce duration-[3000ms]">
                     <div className="text-emerald-500 text-4xl mb-2 font-black">#1</div>
                     <div className="text-slate-500 text-sm font-bold">Nền tảng đặt sân uy tín nhất</div>
                  </div>
               </div>
            </Col>
            <Col xs={24} lg={12}>
               <Title level={2} className="text-4xl font-black mb-8">Sứ mệnh của chúng tôi</Title>
               <Paragraph className="text-slate-600 text-lg leading-relaxed mb-10">
                 Chúng tôi tin rằng việc tiếp cận thể thao nên trở nên dễ dàng, minh bạch và đầy hứng khởi. BadmintonHub sinh ra để xóa bỏ những rào cản trong việc tìm kiếm và đặt sân, giúp các chủ cơ sở vận hành hiệu quả hơn và người chơi có những giây phút tập luyện tuyệt vời nhất.
               </Paragraph>
               
               <Row gutter={[24, 24]}>
                  {VALUES.map((v, i) => (
                    <Col span={24} key={i}>
                       <div className="flex gap-6 group">
                          <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-emerald-500 text-xl group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                             {v.icon}
                          </div>
                          <div>
                             <h4 className="text-lg font-bold text-slate-900 mb-1">{v.title}</h4>
                             <p className="text-slate-500 text-sm">{v.desc}</p>
                          </div>
                       </div>
                    </Col>
                  ))}
               </Row>
            </Col>
          </Row>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-24 bg-white">
         <div className="mx-auto max-w-screen-xl px-6 lg:px-8">
            <Card className="rounded-[48px] bg-slate-900 p-12 md:p-20 text-center border-none relative overflow-hidden">
               <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,#10b981_0,transparent_70%)]" />
               <div className="relative z-10">
                  <h2 className="text-white text-3xl md:text-5xl font-black mb-8">Cùng xây dựng cộng đồng <br /> thể thao lớn mạnh</h2>
                  <p className="text-slate-400 text-lg mb-12 max-w-2xl mx-auto">Cho dù bạn là người chơi đang tìm kiếm sân đấu, hay chủ sân muốn số hóa kinh doanh, chúng tôi luôn ở đây để đồng hành.</p>
                  <Space size="large">
                     <Button 
                       type="primary" 
                       size="large" 
                       onClick={() => navigate('/venues')}
                       className="h-16 px-10 rounded-2xl bg-emerald-500 border-none font-bold text-lg"
                     >
                       Khám phá ngay
                     </Button>
                     <Button 
                       ghost 
                       size="large" 
                       onClick={() => navigate('/partner')}
                       className="h-16 px-10 rounded-2xl border-slate-700 text-white font-bold"
                     >
                       Trở thành đối tác
                     </Button>
                  </Space>
               </div>
            </Card>
         </div>
      </div>
    </div>
  );
}
