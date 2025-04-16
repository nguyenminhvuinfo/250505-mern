import { 
    Box, 
    Heading, 
    HStack, 
    Image, 
    Text, 
    useColorModeValue, 
    IconButton, 
    useToast, 
    Modal,
    ModalOverlay, 
    ModalContent, 
    ModalCloseButton, 
    useDisclosure, 
    ModalHeader, 
    ModalBody, 
    VStack, 
    Input, 
    ModalFooter,
    Button
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { useProductStore } from "../store/product";
import { useState } from "react";



const ProductCard = ({product}) => {
    const [updatedProduct, setUpdatedProduct] = useState(product);
    const textColor = useColorModeValue("gray.600", "gray.200");
    const bg = useColorModeValue("white", "gray.800");

    const {deleteProduct, updateProduct} = useProductStore();
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure()

    const handleDeleteProduct = async (pid) => {
        const {success, message} = await deleteProduct(pid)
        if(!success){
            toast({
              title:"Có lỗi",
              description: message,
              status: "error", 
              isClosable: true
            });
          } else{
            toast({
              title:"Đã xóa sản phẩm",
              description: message,
              status: "success",
              isClosable: true
            });
          }
    }
    const handleUpdateProduct = async (pid, updatedProduct) => {
        const {success, message} = await updateProduct(pid, updatedProduct);
        onClose();
        if(!success){
            toast({
              title:"Có lỗi !!",
              description: message,
              status: "error", 
              isClosable: true
            });
          } else{
            toast({
              title:"Thành công",
              description: "Sản phẩm đã được chỉnh sửa",
              status: "success",
              isClosable: true
            });
          }
    }
  return (
   <Box
   shadow='lg'
   rounded='lg'
   overflow='hidden'
   transition='all 0.3'
   _hover={{transform: "translateY(-5px)", shadow: "xl"}}
   bg={bg}
   >
    <Image src={product.image}  fallbackSrc="https://i.pinimg.com/736x/f0/f8/85/f0f885b81b5848e9b9379f3e6e0a2437.jpg" alt={product.name} h={48} w='full' objectFit = 'cover' />
    <Box p={4}>
        <Heading as='h3' size='md' mb={2}>
            {product.name}
        </Heading>
        <Text fontWeight='bold' fontSize='xl' color={textColor} mb={4}>
            ${product.price}
        </Text>
        <HStack spacing={2}>
            <IconButton 
                icon={<EditIcon />}  
                colorScheme='blue' 
                onClick={onOpen}
            />
			<IconButton
				icon={<DeleteIcon />}
                onClick={ () => handleDeleteProduct(product._id)}
				colorScheme='red'
			/>
        </HStack>
    </Box>
    <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay>
            <ModalContent>
                <ModalHeader> 
                    Chỉnh sửa sản phẩm
                </ModalHeader>
                <ModalCloseButton/>   
                <ModalBody>
					<VStack spacing={4}>
                            <Input
                            placeholder='Tên sản phẩm'
                            value = {updatedProduct.name}
                            name='name'
                            onChange={(e) => setUpdatedProduct({...updatedProduct, name: e.target.value})}
                            />
                            <Input
                            placeholder='Giá tiền'
                            value = {updatedProduct.price}
                            name='price'
                            type='number'
                            onChange={(e) => setUpdatedProduct({...updatedProduct, price: e.target.value})}
                            />
                            <Input
                            placeholder='Link URL Hình ảnh'
                            value = {updatedProduct.image}
                            onChange={(e) => setUpdatedProduct({...updatedProduct, image: e.target.value})}
                            name='image'
                            />
						</VStack>
					</ModalBody>
                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={() => handleUpdateProduct(product._id, updatedProduct)}>
                            Hoàn tất
                        </Button>
                        <Button variant='ghost' onClick={onClose}>
                            Hủy
                        </Button>
                    </ModalFooter>
            </ModalContent>
        </ModalOverlay>

    </Modal>
   </Box>
  );
};
export default ProductCard;