import { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Text,
  useColorModeValue
} from '@chakra-ui/react';

const HotProducts = ({ receipts }) => {
  const [hotProducts, setHotProducts] = useState([]);
  const cardBg = useColorModeValue('white', 'gray.700');

  // Process hot products whenever receipts change
  useEffect(() => {
    if (!receipts) return;
    
    try {
      const now = new Date();
      const productSales = {};
      
      // Find all receipts from today for determining hot products
      const todayReceipts = receipts.filter(receipt => {
        const receiptDate = new Date(receipt.date);
        return receiptDate.toDateString() === now.toDateString();
      });
      
      // Calculate product sales for today
      todayReceipts.forEach(receipt => {
        receipt.products.forEach(product => {
          if (!productSales[product.productId]) {
            productSales[product.productId] = {
              name: product.productName,
              quantity: 0,
              revenue: 0
            };
          }
          productSales[product.productId].quantity += product.quantity;
          productSales[product.productId].revenue += product.price * product.quantity;
        });
      });

      // Filter products with quantity > 10 for today
      const topHotProducts = Object.keys(productSales)
        .map(id => ({ 
          id, 
          ...productSales[id] 
        }))
        .filter(product => product.quantity > 10)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      setHotProducts(topHotProducts);
    } catch (error) {
      console.error("Error processing hot products:", error);
      setHotProducts([]);
    }
  }, [receipts]);

  // Format number as Vietnamese currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
      .format(value)
      .replace('₫', 'đ');
  };

  return (
    <Box 
      p={4} 
      borderRadius="lg" 
      boxShadow="sm" 
      overflow="auto" 
      bg={cardBg}
    >
      <Heading size="md" mb={4}>
        Sản phẩm bán chạy 
      </Heading>
      {hotProducts.length > 0 ? (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Sản phẩm</Th>
              <Th isNumeric>Số lượng bán</Th>
              <Th isNumeric>Doanh thu</Th>
            </Tr>
          </Thead>
          <Tbody>
            {hotProducts.map((product) => (
              <Tr key={product.id}>
                <Td>
                  {product.name}
                  <Badge ml={2} colorScheme="green">Hot</Badge>
                </Td>
                <Td isNumeric>{product.quantity}</Td>
                <Td isNumeric>{formatCurrency(product.revenue)}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      ) : (
        <Text>
          Không có sản phẩm bán trên 10 trong ngày hôm nay
        </Text>
      )}
    </Box>
  );
};

export default HotProducts;