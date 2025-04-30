import { Container, VStack, Heading, useColorModeValue, Input, Button, Box, useToast, Text, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useProductStore } from "../store/product";

const CreatePage = () => {
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    image: "",
  });
  const [formattedPrice, setFormattedPrice] = useState("");
  const toast = useToast();

  const { createProduct } = useProductStore();

  // Format giá tiền từ số sang định dạng VNĐ
  const formatPrice = (amount) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Cập nhật định dạng giá mỗi khi giá thay đổi
  useEffect(() => {
    if (newProduct.price) {
      setFormattedPrice(formatPrice(newProduct.price));
    } else {
      setFormattedPrice("");
    }
  }, [newProduct.price]);

  const handlePriceChange = (e) => {
    // Chỉ cho phép nhập số
    const value = e.target.value.replace(/[^\d]/g, "");
    setNewProduct({ ...newProduct, price: value });
  };

  const handleAddProduct = async() => {
    const {success, message} = await createProduct(newProduct);
    if(!success){
      toast({
        title: "Có lỗi",
        description: message,
        status: "error", 
        isClosable: true
      });
    } else {
      toast({
        title: "Thành công",
        description: message,
        status: "success",
        isClosable: true
      });
      // Reset form sau khi thêm thành công
      setNewProduct({
        name: "",
        price: "",
        image: "",
      });
      setFormattedPrice("");
    }
  };

  return (
    <Container maxW={"container.sm"}>
      <VStack spacing={8}>
        <Heading as={"h1"} size={"2xl"} textAlign={"center"} mb={8}>
          Thêm sản phẩm mới
        </Heading>
        <Box
          w={"full"} 
          bg={useColorModeValue("white", "gray.800")}
          p={6} 
          rounded={"lg"} 
          shadow={"md"}
        >
          <VStack spacing={4}>
            <Input
              placeholder="Tên sản phẩm"
              name="name"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value})}
            />
            
            <VStack spacing={1} w="full" align="start">
              <Input
                placeholder="Giá sản phẩm"
                name="price"
                value={newProduct.price}
                onChange={handlePriceChange}
              />
              {newProduct.price && (
                <Text fontSize="sm" color="gray.500">
                  {formattedPrice}
                </Text>
              )}
            </VStack>
            
            <Input
              placeholder="Hình ảnh sản phẩm"
              name="image"
              value={newProduct.image}
              onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value})}
            />
            
            <Button colorScheme="blue" onClick={handleAddProduct} w="full">
              Thêm sản phẩm 
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
}

export default CreatePage;