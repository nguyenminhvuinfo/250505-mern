import { Container, VStack, Heading, useColorModeValue, Input, Button, Box, useToast} from "@chakra-ui/react";
import { useState } from "react";
import { useProductStore } from "../store/product";
const CreatePage = () => {
  /* này là tạo sản phẩm rỗng để tí thêm vào */
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    image: "",
  });
  const toast = useToast();

  const {createProduct} = useProductStore();

  const handleAddProduct = async() => {
    const {success,message} = await createProduct(newProduct);
    if(!success){
      toast({
        title:"Có lỗi",
        description: message,
        status: "error", 
        isClosable: true
      });
    } else{
      toast({
        title:"Thành công",
        description: message,
        status: "success",
        isClosable: true
      });
    }
  };
  return (
    /* này là cái đống form hiện ra khi nhấn add nha Cá Doi */
    <Container maxW={"container.sm"}>
      <VStack
        spacing={8}
      >
        <Heading as={"h1"} size={"2xl"} textAlign={"center"} mb={8}>
          Thêm sản phẩm mới
        </Heading>
        <Box
          w={"full"} bg={useColorModeValue("white", "gray.800")}
          p={6} rounded={"lg"} shadow={"md"}
        >
          <VStack spacing={4}>
            <Input
              placeholder="Tên sản phẩm"
              name = 'name'
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value})}
            />
            <Input
              placeholder="Giá sản phẩm"
              name = 'price'
              type = 'number'
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value)})}
            />
            <Input
              placeholder="Hình ảnh sản phẩm"
              name = 'image'
              value={newProduct.image}
              onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value})}
            />
            
            <Button colorScheme="blue" onClick={handleAddProduct} w='full'>
              Thêm sản phẩm 
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
}

export default CreatePage