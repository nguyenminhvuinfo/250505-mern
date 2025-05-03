import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  useColorModeValue
} from '@chakra-ui/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const RevenueStatistics = ({ isOpen, onClose }) => {
  const [filter, setFilter] = useState('thisMonth');
  const [revenueData, setRevenueData] = useState({
    total: 0,
    orderCount: 0,
    previousPeriodGrowth: 0,
    chartData: [],
    topProducts: []
  });

  const bgColor = useColorModeValue('white', 'gray.800');
  const cardBg = useColorModeValue('white', 'gray.700');
  const tooltipBg = useColorModeValue('white', 'gray.700');
  const tooltipColor = useColorModeValue('black', 'white');


  // Simulate fetching data based on the filter
  useEffect(() => {
    // In a real app, this would be an API call to get data based on the filter
    const fetchData = async () => {
      // Simulated data for demonstration
      let simulatedData;
      
      switch (filter) {
        case 'today':
          simulatedData = {
            total: 1200000,
            orderCount: 12,
            previousPeriodGrowth: 5,
            chartData: [
              { time: '8:00', revenue: 100000 },
              { time: '10:00', revenue: 250000 },
              { time: '12:00', revenue: 320000 },
              { time: '14:00', revenue: 150000 },
              { time: '16:00', revenue: 180000 },
              { time: '18:00', revenue: 200000 },
            ],
            topProducts: [
              { id: 1, name: 'Sản phẩm A', quantity: 5, revenue: 500000 },
              { id: 2, name: 'Sản phẩm B', quantity: 3, revenue: 300000 },
              { id: 3, name: 'Sản phẩm C', quantity: 2, revenue: 200000 },
              { id: 4, name: 'Sản phẩm D', quantity: 1, revenue: 100000 },
              { id: 5, name: 'Sản phẩm E', quantity: 1, revenue: 100000 },
            ]
          };
          break;
        case 'thisWeek':
          simulatedData = {
            total: 8500000,
            orderCount: 85,
            previousPeriodGrowth: 12,
            chartData: [
              { time: 'T2', revenue: 1200000 },
              { time: 'T3', revenue: 1500000 },
              { time: 'T4', revenue: 1800000 },
              { time: 'T5', revenue: 1300000 },
              { time: 'T6', revenue: 1400000 },
              { time: 'T7', revenue: 1000000 },
              { time: 'CN', revenue: 300000 },
            ],
            topProducts: [
              { id: 1, name: 'Sản phẩm A', quantity: 35, revenue: 3500000 },
              { id: 2, name: 'Sản phẩm F', quantity: 22, revenue: 2200000 },
              { id: 3, name: 'Sản phẩm B', quantity: 15, revenue: 1500000 },
              { id: 4, name: 'Sản phẩm G', quantity: 8, revenue: 800000 },
              { id: 5, name: 'Sản phẩm H', quantity: 5, revenue: 500000 },
            ]
          };
          break;
        case 'thisMonth':
          simulatedData = {
            total: 35000000,
            orderCount: 350,
            previousPeriodGrowth: 8,
            chartData: [
              { time: 'Tuần 1', revenue: 8000000 },
              { time: 'Tuần 2', revenue: 9500000 },
              { time: 'Tuần 3', revenue: 8500000 },
              { time: 'Tuần 4', revenue: 9000000 },
            ],
            topProducts: [
              { id: 1, name: 'Sản phẩm A', quantity: 120, revenue: 12000000 },
              { id: 2, name: 'Sản phẩm F', quantity: 80, revenue: 8000000 },
              { id: 3, name: 'Sản phẩm I', quantity: 75, revenue: 7500000 },
              { id: 4, name: 'Sản phẩm B', quantity: 50, revenue: 5000000 },
              { id: 5, name: 'Sản phẩm J', quantity: 25, revenue: 2500000 },
            ]
          };
          break;
        case 'thisYear':
          simulatedData = {
            total: 420000000,
            orderCount: 4200,
            previousPeriodGrowth: 15,
            chartData: [
              { time: 'T1', revenue: 35000000 },
              { time: 'T2', revenue: 32000000 },
              { time: 'T3', revenue: 38000000 },
              { time: 'T4', revenue: 36000000 },
              { time: 'T5', revenue: 37000000 },
              { time: 'T6', revenue: 34000000 },
              { time: 'T7', revenue: 33000000 },
              { time: 'T8', revenue: 39000000 },
              { time: 'T9', revenue: 41000000 },
              { time: 'T10', revenue: 38000000 },
              { time: 'T11', revenue: 40000000 },
              { time: 'T12', revenue: 37000000 },
            ],
            topProducts: [
              { id: 1, name: 'Sản phẩm A', quantity: 1450, revenue: 145000000 },
              { id: 2, name: 'Sản phẩm F', quantity: 950, revenue: 95000000 },
              { id: 3, name: 'Sản phẩm I', quantity: 850, revenue: 85000000 },
              { id: 4, name: 'Sản phẩm K', quantity: 550, revenue: 55000000 },
              { id: 5, name: 'Sản phẩm L', quantity: 400, revenue: 40000000 },
            ]
          };
          break;
        default:
          simulatedData = {
            total: 35000000,
            orderCount: 350,
            previousPeriodGrowth: 8,
            chartData: [
              { time: 'Tuần 1', revenue: 8000000 },
              { time: 'Tuần 2', revenue: 9500000 },
              { time: 'Tuần 3', revenue: 8500000 },
              { time: 'Tuần 4', revenue: 9000000 },
            ],
            topProducts: [
              { id: 1, name: 'Sản phẩm A', quantity: 120, revenue: 12000000 },
              { id: 2, name: 'Sản phẩm F', quantity: 80, revenue: 8000000 },
              { id: 3, name: 'Sản phẩm I', quantity: 75, revenue: 7500000 },
              { id: 4, name: 'Sản phẩm B', quantity: 50, revenue: 5000000 },
              { id: 5, name: 'Sản phẩm J', quantity: 25, revenue: 2500000 },
            ]
          };
      }

      setRevenueData(simulatedData);
    };

    fetchData();
  }, [filter]);

  // Format number as Vietnamese currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
      .format(value)
      .replace('₫', 'đ');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalOverlay />
      <ModalContent bg={bgColor}>
        <ModalHeader>Thống kê doanh thu</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {/* Filter */}
          <Flex justifyContent="flex-end" mb={4}>
            <Select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)} 
              width="200px"
            >
              <option value="today">Hôm nay</option>
              <option value="thisWeek">Tuần này</option>
              <option value="thisMonth">Tháng này</option>
              <option value="thisYear">Năm nay</option>
            </Select>
          </Flex>

          {/* Cards */}
          <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4} mb={6}>
            <Stat p={4} borderRadius="lg" boxShadow="sm" bg={cardBg}>
              <StatLabel>Tổng doanh thu</StatLabel>
              <StatNumber>{formatCurrency(revenueData.total)}</StatNumber>
              <StatHelpText>
                <StatArrow type={revenueData.previousPeriodGrowth >= 0 ? "increase" : "decrease"} />
                {Math.abs(revenueData.previousPeriodGrowth)}% so với kỳ trước
              </StatHelpText>
            </Stat>
            <Stat p={4} borderRadius="lg" boxShadow="sm" bg={cardBg}>
              <StatLabel>Tổng đơn hàng</StatLabel>
              <StatNumber>{revenueData.orderCount}</StatNumber>
              <StatHelpText>
                Đơn hàng trung bình: {formatCurrency(revenueData.total / revenueData.orderCount)}
              </StatHelpText>
            </Stat>
          </Grid>

          {/* Chart */}
          <Box 
            mb={6} 
            p={4} 
            borderRadius="lg" 
            boxShadow="sm" 
            height="400px" 
            bg={cardBg}
          >
            <Heading size="md" mb={4}>Biểu đồ doanh thu theo thời gian</Heading>
            <ResponsiveContainer width="100%" height="90%">
              <LineChart
                data={revenueData.chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis tickFormatter={(value) => `${value / 1000000}tr`} />
                <Tooltip formatter={(value) => formatCurrency(value)} 
                    contentStyle={{
                        backgroundColor: tooltipBg,
                        color: tooltipColor,
                        border: 'none',
                        borderRadius: '8px',
                    }}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#4299E1" 
                  strokeWidth={2} 
                  name="Doanh thu" 
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>

          {/* Top Products Table */}
          <Box 
            p={4} 
            borderRadius="lg" 
            boxShadow="sm" 
            overflow="auto" 
            bg={cardBg}
          >
            <Heading size="md" mb={4}>Sản phẩm bán chạy</Heading>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Sản phẩm</Th>
                  <Th isNumeric>Số lượng bán</Th>
                  <Th isNumeric>Doanh thu</Th>
                </Tr>
              </Thead>
              <Tbody>
                {revenueData.topProducts.map((product) => (
                  <Tr key={product.id}>
                    <Td>{product.name}</Td>
                    <Td isNumeric>{product.quantity}</Td>
                    <Td isNumeric>{formatCurrency(product.revenue)}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Đóng
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default RevenueStatistics;